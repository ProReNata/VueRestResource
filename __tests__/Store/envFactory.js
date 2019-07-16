import Vue from 'vue';
import Vuex from 'vuex';
import vrr from '../../src';

const {
  storeBoilerplateGenerator,
  createVueRestResource,
  asyncResourceValue,
  asyncResourceGetter,
  registerResource,
  resourceListGetter,
} = vrr;

Vue.use(Vuex);



export default (customRestConfig = {}) => {
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
  const store = new Vuex.Store(storeDefinition);
  const RestConfig = {
    baseUrl: 'http://localhost:8984', // Development URL
    defaultParams: {},
    httpHeaders: {},
    vrrModuleName: 'VRR_Tests',
    store,
    ...customRestConfig
  };
  const VRR = createVueRestResource(RestConfig);

  return {
    asyncResourceValue,
    asyncResourceGetter,
    registerResource,
    resourceListGetter,
    store,
    storeBoilerplateGenerator,
    ...VRR,
  };
};
