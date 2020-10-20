import axios from 'axios';
import Http from './Http';
import Subscriber from './subscriber';
import componentRegisterMap from './componentRegisterMap';

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getRequestSignature = (req) => {
  const params = Object.keys(req.params || []).filter((param) => param[0] !== '_');

  return `${req.endpoint}_${(params || []).join('&')}`;
};

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

const handleQueueOnBadRequest = (req) => {
  const signature = getRequestSignature(req);
  delete globalQueue.activeRequests[signature];
  delete globalQueue.queuedRequests[signature];
};

let requestCounter = 0;

export default class Rest extends Http {
  constructor(resource, config) {
    super(resource, config);
    this.store = config.store;

    this.logEndpoints = Boolean(config.logEndpoints);
    this.logInstance = Boolean(config.logInstance);
    this.vrrModuleName = config.vrrModuleName;
    const {logEndpoints, logInstance, store} = this;
    this.updateStore = function updateStore(storeAction, payload) {
      if (logEndpoints || logInstance) {
        store.dispatch(storeAction, payload);
      }
    };
  }

  // Dispatcher methods (overrides HTTP dispatch method)
  dispatch(action, {endpoint, handler, callback, apiModel, apiModule, deletedId, callerInstance}, ...args) {
    const mutation = [apiModule, `${action}${capitalizeFirst(apiModel)}`].filter(Boolean).join('/');

    const actionType = action === 'list' ? 'get' : action; // axios has no 'list'

    const REGISTER_REQUEST = `${this.vrrModuleName}/registerRequest`;
    const UPDATE_REQUEST = `${this.vrrModuleName}/updateRequest`;
    const DELETE_INSTANCE = `${this.vrrModuleName}/deleteInstance`;
    const {logEndpoints, logInstance, updateStore} = this;

    let instanceUUID = null;

    if (logInstance) {
      instanceUUID = componentRegisterMap.add(callerInstance);

      if (callerInstance && callerInstance.$once) {
        callerInstance.$once('hook:beforeDestroy', () => {
          updateStore(DELETE_INSTANCE, instanceUUID);
        });
      }
    }

    let discard = false;
    // prepare for request timeout
    let timeout = false;

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
      {apiModel, apiModule, endpoint, callerInstance: instanceUUID, logEndpoints, logInstance},
      ...args,
    );

    request.cancel = () => {
      discard = true;
      updateStore(UPDATE_REQUEST, {
        ...request,
        status: 'canceled',
        completed: Date.now(),
      });
    };

    updateStore(REGISTER_REQUEST, {
      ...request,
    });

    // prepare for slow request
    const slowRequest = setTimeout(() => {
      updateStore(UPDATE_REQUEST, {
        ...request,
        status: 'slow',
      });
    }, this.slowTimeout);

    const requestTimeout = setTimeout(() => {
      timeout = true;
      updateStore(UPDATE_REQUEST, {
        ...request,
        completed: Date.now(),
        status: 'timeout',
      });
    }, this.failedTimeout);

    const ajax = this.handleQueue(request, actionType, endpoint, ...args);
    /* @todo: add a global warning component when requests fail */

    // tell the store a request was fired
    updateStore(UPDATE_REQUEST, {
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
        const responseCopy = JSON.parse(JSON.stringify({data: response.data}));
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
          updateStore(mutation, data);
        }

        const updated = {
          ...request,
          completed: Date.now(),
          response: data,
          status: 'success',
        };

        updateStore(UPDATE_REQUEST, updated);

        // lets use setTimeout so we don't remove the request before the Subscriber promise resolves
        setTimeout(() => this.unregister(request), 1);

        const signature = getRequestSignature(request);
        const activeRequest = globalQueue.activeRequests[signature];

        if (activeRequest && activeRequest.id === request.id) {
          globalQueue.queuedRequests[signature].forEach((queued) => {
            queued.request.status = updated.status;
            queued.request.completed = updated.completed;
            queued.request.Promise.resolve(response); // resolve pending requests with same response
            setTimeout(() => this.unregister(queued.request), 1);
          });

          globalQueue.queuedRequests[signature] = []; // done, reset pending requests array
          delete globalQueue.activeRequests[signature]; // done, remove the active request pointer
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
          internalError: err,
        };

        updateStore(UPDATE_REQUEST, updated);

        handleQueueOnBadRequest(request);
      });

    const {store} = this;

    return new Promise((resolve, reject) => {
      new Subscriber(endpoint, request.id, store, UPDATE_REQUEST).onSuccess(resolve).onFail((data) => {
        handleQueueOnBadRequest(request);
        reject(data);
      });
    });
  }

  handleQueue(request, action, endpoint, ...args) {
    if (action !== 'get') {
      // NB: check comment text about implementation of "update" requests inside queue of "get"s (on top of this file)
      return axios[action](endpoint, ...args);
    }

    // check if there is a active request to the same endpoint

    const signature = getRequestSignature(request);
    const activeRequest = globalQueue.activeRequests[signature];

    if (!activeRequest) {
      globalQueue.activeRequests[signature] = request;

      return axios[action](endpoint, ...args);
    }

    if (!globalQueue.queuedRequests[signature]) {
      globalQueue.queuedRequests[signature] = [];
    }

    // pending request already registered, queue this request
    globalQueue.queuedRequests[signature].push({
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
    this.updateStore(UNREGISTER, request);
  }
}
