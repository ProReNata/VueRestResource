import Vue from 'vue';
import Vuex from 'vuex';
import vrr from '../../src';

const {storeBoilerplateGenerator, createVueRestResource} = vrr;

Vue.use(Vuex);

export default (customRestConfig = {}) => {
  const storeDefinition = {
    actions: {},
    getters: {},
    modules: {},
    mutations: {},
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
    errorHandler(err) {
      console.log('errorHandler', err);
    },
    ...customRestConfig,
  };
  const VRR = createVueRestResource(RestConfig);

  return {
    store,
    storeBoilerplateGenerator,
    ...VRR,
  };
};
