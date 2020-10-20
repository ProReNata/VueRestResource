import axios from 'axios';

const defaultResourceHandlers = {
  create: (response) => response.data,
  get: (response) => response.data,
  list: (response) => response.data.objects,
  update: (response) => response.data,
  remote: (response) => response.data,
};

export default class {
  constructor(resource, config) {
    this.handler = {
      // set the default handler if its not overridden in the local module resource
      ...defaultResourceHandlers,
      ...(resource.handler || {}),
    };
    this.errorHandler = config.errorHandler;
    this.baseUrl = config.baseUrl;
    this.slowTimeout = config.slowTimeout || 2000;
    this.failedTimeout = config.failedTimeout || 15000;

    this.apiModel = resource.apiModel;
    this.apiModule = resource.apiModule;
    this.endpoint = `${[this.baseUrl, this.apiModule, this.apiModel]
      .filter(Boolean)
      .join('/')
      .toLowerCase()}/`;
    this.defaultParams = config.defaultParams;
    this.httpHeaders = {headers: config.httpHeaders};
    this.resource = resource;

    this.actionObjectDefault = {
      apiModel: this.apiModel,
      apiModule: this.apiModule,
    };
  }

  get(callerInstance, id, data = {}, cb) {
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: `${this.endpoint + id}/`,
      handler: this.handler.get,
      callerInstance,
    };

    return this.dispatch('get', resources, {
      headers: this.httpHeaders,
      params: {
        ...data,
        ...this.defaultParams,
      },
    }).catch(this.errorHandler);
  }

  list(callerInstance, data = {}, cb) {
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: this.endpoint,
      handler: this.handler.list,
      callerInstance,
    };

    const resp = this.dispatch('list', resources, {
      ...this.httpHeaders,
      params: {
        ...data,
        ...this.defaultParams,
      },
    }).catch(this.errorHandler);

    return resp;
  }

  create(callerInstance, data = {}, cb) {
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: this.endpoint,
      handler: this.handler.create,
      callerInstance,
    };

    return this.dispatch('post', resources, data, {
      ...this.httpHeaders,
    }).catch(this.errorHandler);
  }

  update(callerInstance, id, data = {}, cb) {
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: `${this.endpoint + id}/`,
      handler: this.handler.update,
      callerInstance,
    };

    return this.dispatch('put', resources, data, {
      ...this.httpHeaders,
    }).catch(this.errorHandler);
  }

  delete(callerInstance, id, cb) {
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      deletedId: id,
      endpoint: `${this.endpoint + id}/`,
      handler: this.handler.delete || (() => id),
      callerInstance,
    };

    return this.dispatch('delete', resources, {
      ...this.httpHeaders,
    }).catch(this.errorHandler);
  }

  remoteAction(callerInstance, id, data = {}) {
    const options = this.resource.remoteAction(this, id, data, this.actionObjectDefault);

    if (!options.handler) {
      options.handler = defaultResourceHandlers.remote;
    }

    options.callerInstance = callerInstance;

    return this.dispatch(this.resource.httpMethod, options, data, {
      headers: {
        ...this.httpHeaders.headers,
        'Content-Type': 'application/json',
      },
    }).catch(this.errorHandler);
  }

  // dispatch for de-coupled components
  dispatch(action, {endpoint, handler}, ...args) {
    /*
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *     This class method is only for components that           *
     *     need to speak with server de-coupled from store.        *
     *     Rule is: all Components should instantiate methods.js   *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     */
    const actionType = action === 'list' ? 'get' : action; // axios has no 'list'
    const ajax = axios[actionType](endpoint, ...args);

    return ajax
      .then((res) => handler(res))
      .catch((error) => {
        console.error(error);

        throw new Error(error);
      });
  }
}
