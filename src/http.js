import axios from 'axios';
import HTTP from './methods';
import Subscriber from './subscriber';

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/*
 * Global Queue has the purpose of preventing N requests being sent in a row to same endpoint.
 *
 * If 1 request is pending to a specific endpoint a success result will be applied to all
 * queued requests, without them having to be fired to server.
 *
 * All requests gets registered in store as pending, so we can track they existed.
 * We add a prop .debouncedResponse with value: null - if the request got its own
 * response; Object - the request object of the request that got the response data
 *
 * Not implemented yet:
 *
 *     If a "update" request gets in between 2 get requests, the earlier "get" will be
 *     postponed, we send the "update" to server and apply its response to both "get"s.
 *
 */
const globalQueue = {
  activeRequests: {}, // endpoints as key values
  queuedRequests: {}, // endpoints as key values
};

let requestCounter = 0;

export default class Rest extends HTTP {
  constructor(resource, config) {
    super(resource, config);
    this.store = config.store;

    this.logEndpoints = Boolean(config.logEndpoints);
    this.logInstance = Boolean(config.logInstance);
    this.vrrModuleName = config.vrrModuleName;
  }

  // Dispatcher methods (overrides HTTP dispatch method)
  dispatch(action, {endpoint, handler, callback, apiModel, apiModule, deletedId, callerInstance}, ...args) {
    const mutation = [apiModule, `${action}${capitalizeFirst(apiModel)}`].filter(Boolean).join('/');

    const actionType = action === 'list' ? 'get' : action; // axios has no 'list'

    const REGISTER_COMPONENT = `${this.vrrModuleName}/registerComponentInStore`;
    const REGISTER = `${this.vrrModuleName}/registerRequest`;
    const UPDATE = `${this.vrrModuleName}/updateRequest`;
    const {logEndpoints, logInstance} = this;

    let discard = false;

    /*
     * Status types:
     *   - registered (before axios is called)
     *   - success
     *   - failed
     *   - slow
     *   - timeout
     *   - pending
     */

    const request = this.register(
      actionType,
      {apiModel, apiModule, endpoint, callerInstance, logEndpoints, logInstance},
      ...args,
    );

    request.cancel = () => {
      discard = true;
      this.store.dispatch(UPDATE, {
        ...request,
        status: 'canceled',
        completed: Date.now(),
      });
    };

    if (this.logInstance) {
      this.store.dispatch(REGISTER_COMPONENT, callerInstance);
    }

    this.store.dispatch(REGISTER, {
      ...request,
    });

    // prepare for slow request
    const slowRequest = setTimeout(() => {
      this.store.dispatch(UPDATE, {
        ...request,
        status: 'slow',
      });
    }, this.slowTimeout);

    // prepare for request timeout
    let timeout = false;
    const requestTimeout = setTimeout(() => {
      timeout = true;
      this.store.dispatch(UPDATE, {
        ...request,
        completed: Date.now(),
        status: 'timeout',
      });
    }, this.failedTimeout);

    const ajax = this.handleQueue(request, actionType, endpoint, ...args);
    /* @todo: add a global warning component when requests fail */

    // tell the store a request was fired
    this.store.dispatch(UPDATE, {
      ...request,
      status: 'pending',
    });

    ajax
      .then((res) => {
        clearTimeout(slowRequest);
        clearTimeout(requestTimeout);

        if (timeout || discard) {
          return undefined;
        }

        const response = !res && action === 'delete' ? deletedId : res;
        const responseCopy = JSON.parse(JSON.stringify({data: response.data})); //
        const data = handler(responseCopy, this.store);

        /*
         * About using callbacks here:
         * Sometimes the data Axios gets needs to be processed. We can do this in
         * the Store or in the Controller of the component. Use callback & Controller
         * pattern if you want to keep the store "logic free".
         */

        if (callback) {
          // Used in some controllers when data from server needs to be processed before being set in store
          callback(data, this.store);
        } else {
          this.store.dispatch(mutation, data);
        }

        const updated = {
          ...request,
          completed: Date.now(),
          response: data,
          status: 'success',
        };

        this.store.dispatch(UPDATE, updated);

        // lets use setTimeout so we don't remove the request before the Subscriber promise resolves
        setTimeout(() => this.unregister(request), 1);

        const aciveRequest = globalQueue.activeRequests[endpoint];

        if (aciveRequest && aciveRequest.id === request.id) {
          const queuedRquestsIteratee = function queuedRquestsIteratee(queued) {
            queued.request.Promise.resolve(response); // resolve pending requests with same response
          };

          globalQueue.queuedRequests[endpoint].forEach(queuedRquestsIteratee);

          globalQueue.queuedRequests[endpoint] = []; // done, reset pending requests array
          delete globalQueue.activeRequests[endpoint]; // done, remove the active request pointer
        }

        return undefined;
      })
      .catch((err) => {
        clearTimeout(slowRequest);
        clearTimeout(requestTimeout);
        this.unregister(request);

        const updated = {
          ...request,
          completed: Date.now(),
          response: err.response && err.response.data,
          status: 'failed',
        };

        this.store.dispatch(UPDATE, updated);

        if (globalQueue.queuedRequests[endpoint]) {
          // call next in queue
          const activeRequest = globalQueue.activeRequests[endpoint];

          if (activeRequest && activeRequest.id === request.id) {
            delete globalQueue.activeRequests[endpoint];
            const next = globalQueue.queuedRequests[endpoint].shift();

            if (next) {
              const {request: rqst, action: act, endpoint: end, args: rest} = next;

              this.handleQueue(rqst, act, end, ...rest);
            }
          }
        }

        // TODO / QUESTION: maybe we should also unregister the request?
        // this.unregister(request);
        console.error('VRR error', err);
      });

    const {store} = this;

    return new Promise((resolve, reject) => {
      new Subscriber(endpoint, request.id, store, UPDATE).onSuccess(resolve).onFail(reject);
    });
  }

  handleQueue(request, action, endpoint, ...args) {
    if (action !== 'get') {
      // NB: check comment text about implementation of "update" requests inside queue of "get"s (on top of this file)
      return axios[action](endpoint, ...args);
    }

    // we need to design what patterns to look for that are common in all requests so
    // we can know with certainty that 2 requests look for the same resource
    // the "_" param is global, so now we just ignore handling queue in requests that have params
    if (request.params && Object.keys(request.params).length > 1) {
      return axios[action](endpoint, ...args);
    }

    if (!globalQueue.activeRequests[endpoint]) {
      // first request, no queue
      globalQueue.activeRequests[endpoint] = request;

      if (!globalQueue.queuedRequests[endpoint]) {
        globalQueue.queuedRequests[endpoint] = [];
      }

      return axios[action](endpoint, ...args);
    }

    // pending request already registered, queue this request
    const pending = globalQueue.queuedRequests[endpoint];
    pending.push({
      action,
      args,
      endpoint,
      request,
    });

    const executor = function executor(resolve, reject) {
      request.Promise = {reject, resolve};
    };

    const deferred = new Promise(executor);

    request.Promise.instance = deferred;

    return deferred;
  }

  register(action, moduleInfo, ...args) {
    requestCounter += 1;
    const id = [moduleInfo.apiModule, moduleInfo.apiModel, requestCounter].join('_');
    const httpData = args.find((obj) => obj.params);
    const params = httpData && httpData.params;

    return {
      ...moduleInfo,
      action,
      created: Date.now(),
      id,
      params,
      status: 'registered',
    };
  }

  unregister(request) {
    const UNREGISTER = `${this.vrrModuleName}/unregisterRequest`;
    this.store.dispatch(UNREGISTER, request);
  }
}
