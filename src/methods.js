import axios from 'axios';
import noop from 'lodash/noop';

const defaultResourceHandlers = {
  create: response => response.data,
  get: response => response.data,
  list: response => response.data.objects,
  update: response => response.data,
};

export default class {
  constructor(resource, config){
    this.handler = {
      // set the default handler if its not overrided in the local module resource
      ...defaultResourceHandlers,
      ...resource.handler,
    };
    this.baseUrl = config.baseUrl;
    this.slowTimeout = config.slowTimeout || 2000;
    this.failedTimeout = config.failedTimeout || 15000;

    this.apiModel = resource.apiModel;
    this.apiModule = resource.apiModule;
    this.endpoint = `${this.baseUrl}/${this.apiModule}/${this.apiModel}/`.toLowerCase();
    this.defaultParams = config.defaultParams;
    this.httpHeaders = {headers: config.httpHeaders};
    this.resource = resource;

    this.actionObjectDefault = {
      apiModel: this.apiModel,
      apiModule: this.apiModule,
    };
  }
  get(id, data = {}, cb){
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: `${this.endpoint + id}/`,
      handler: this.handler.get,
    };
    return this.dispatch('get', resources, {
      headers: this.httpHeaders,
      params: {
        ...data,
        ...this.defaultParams,
      },
    });
  }

  list(data = {}, cb){
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: this.endpoint,
      handler: this.handler.list,
    };
    return this.dispatch('list', resources, {
      ...this.httpHeaders,
      params: {
        ...data,
        ...this.defaultParams,
      },
    });
  }

  create(data = {}, cb){
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: this.endpoint,
      handler: this.handler.create,
    };
    return this.dispatch('post', resources, data, {
      ...this.httpHeaders,
    });
  }

  update(id, data = {}, cb){
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: `${this.endpoint + id}/`,
      handler: this.handler.update,
    };
    return this.dispatch('put', resources, data, {
      ...this.httpHeaders,
    });
  }

  delete(id, cb){
    const resources = {
      ...this.actionObjectDefault,
      callback: cb,
      endpoint: `${this.endpoint + id}/`,
      handler: this.handler.delete || (() => id),
    };
    return this.dispatch('delete', resources, {
      ...this.httpHeaders,
    });
  }

  remoteAction(id, data = {}){
    const resources = this.resource.remoteAction(id, data, this.actionObjectDefault, this);
    if (!resources.handler) resources.handler = noop;

    return this.dispatch(this.resource.httpMethod, resources, data, {
      headers: {
        ...this.httpHeaders.headers,
        'Content-Type': 'application/json',
      },
    });
  }

  // dispatch for de-coupled components
  dispatch(action, {endpoint, handler}, ...args){
    /* * * * * * * * * * * ** * * * * * * * * * * * * * * * * *
    *     This class method is only for components that       *
    *      need to speak with server de-coupled from store.    *
    *     Rule is: all Components should instanciate methods.js  *
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    if (action === 'list') action = 'get'; // axios has no 'list'
    const ajax = axios[action](endpoint, ...args);
    return ajax.then(res => handler(res)).catch((reason) => {
      console.log('methods dispatch', reason);
    });
  }
}