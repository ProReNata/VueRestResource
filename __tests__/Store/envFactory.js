import Vue from 'vue';
import Vuex from 'vuex';
import Hints from '../Modules/Hints/Store/store';
import vrr from '../../src'; // dev-path

Vue.use(Vuex);

const Modules = {
  Hints,
};

// turn ON namespacing in modules
const moduleKeyIteratee = function _moduleKeyIteratee(key) {
  Modules[key].namespaced = true;
};

Object.keys(Modules).forEach(moduleKeyIteratee);

const storeDefinition = {
  actions: {},

  getters: {},

  modules: Modules,

  mutations: {},

  namespaced: true,

  // only for global stuff, otherwise use modules
  state: {},

  strict: false,
};

export default () => {
  const store = new Vuex.Store(storeDefinition);

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
