// Prepare Vuex, our Store
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Import Modules
import Hints from '../Modules/Hints/Store/store';

const Modules = {
  Hints,
};

// turn ON namespacing in modules
const moduleKeyIteratee = function _moduleKeyIteratee(key) {
  Modules[key].namespaced = true;
};

Object.keys(Modules).forEach(moduleKeyIteratee);

export default new Vuex.Store({
  actions: {},

  getters: {},

  modules: Modules,

  mutations: {},

  namespaced: true,

  // only for global stuff, otherwise use modules
  state: {},

  strict: true,
});
