import Vue from 'vue';
import Vuex from 'vuex';
import vrr from '../../src';
import storeBoilerplateGenerator from './Utils/storeBoilerplateGenerators';

Vue.use(Vuex);


const storeDefinition = {
  actions: {},

  getters: {},

  modules: {},

  mutations: {},

  namespaced: true,

  // only for global stuff, otherwise use modules
  state: {},

  strict: false,
};

export default (resources = []) => {
  const store = new Vuex.Store(storeDefinition);

  resources.forEach(resource => {
    const resourceStore = storeBoilerplateGenerator(resource);
    const nameSpace = resource['__name'];
    store.registerModule(nameSpace, {
      ...resourceStore,
      namespaced: true,
    });
  });

  const RestConfig = {
    baseUrl: 'http://localhost:8984', // Development URL
    defaultParams: {},
    httpHeaders: {},
    store,
  };

  const {asyncResourceValue, asyncResourceGetter, registerResource, resourceListGetter} = vrr(RestConfig);

  return {
    asyncResourceValue,
    asyncResourceGetter,
    registerResource,
    resourceListGetter,
    store,
  };
};
