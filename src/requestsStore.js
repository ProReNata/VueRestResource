import noop from 'lodash/noop';

const actions = {
  init: noop,
  registerComponentInStore(store, uuid) {
    store.commit('registerComponent', uuid);
  },
  registerRequest(store, req) {
    store.commit('registerRequest', req);
  },
  unregisterComponentInStore(store, uuid) {
    store.commit('unregisterComponent', uuid);
  },
  unregisterRequest(store, ref) {
    store.commit('unregisterRequest', ref);
  },
  updateRequest(store, req) {
    store.commit('updateRequest', req);
  },
};

const mutations = {
  registerComponent(state, uuid) {
    if (state.registeredComponents[uuid]) {
      throw new Error('component already registered');
    }

    state.registeredComponents[uuid] = [];
  },
  registerRequest(state, req) {
    state.registeredComponents[req.uuid].push({...req});

    // register by endpoint
    const current = state.activeRequestsToEndpoint[req.endpoint] || [];
    state.activeRequestsToEndpoint = {
      ...state.activeRequestsToEndpoint,
      [req.endpoint]: current.concat(req),
    };
  },
  unregisterComponent(state, uuid) {
    if (!state.registeredComponents[uuid]) {
      throw new Error('component not registered');
    }

    state.registeredComponents[uuid] = null;
    delete state.registeredComponents[uuid];
  },
  unregisterRequest(state, request) {
    const {id, endpoint} = request;

    // unregister endpoint
    const activeRequestsToEndpointPredicate = function activeRequestsToEndpointPredicate(req) {
      return req.id !== id;
    };

    const others = state.activeRequestsToEndpoint[endpoint].filter(activeRequestsToEndpointPredicate);
    state.activeRequestsToEndpoint = {
      ...state.activeRequestsToEndpoint,
      [endpoint]: others,
    };
  },
  updateRequest(state, req) {
    // Since we cannot use listener for complex/nested objects
    // we use a shallow state key that triggers listeners in components
    // and they can check if the change is related to them or ignore the call
    state.lastUpdatedComponent = req.uuid;
    const componentRequests = state.registeredComponents[req.uuid];
    const componentRequestsPredicate = function componentRequestsPredicate(r) {
      return r.id === req.id && r.uuid === req.uuid;
    };

    const index = componentRequests.findIndex(componentRequestsPredicate);

    if (index === -1) {
      console.info('store mutations > updateRequest: Request not found in store');
    }

    const componentRequestsIteratee = function componentRequestsIteratee(entry, i) {
      return index === i ? req : entry;
    };

    state.registeredComponents = {
      ...state.registeredComponents,
      [req.uuid]: componentRequests.map(componentRequestsIteratee),
    };
  },
};

const getters = {
  activeRequestsToEndpoint(state) {
    return state.activeRequestsToEndpoint;
  },
  lastUpdatedComponent(state) {
    return state.lastUpdatedComponent;
  },
  registeredComponents(state) {
    return state.registeredComponents;
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state: {
    activeRequestsToEndpoint: {},
    lastUpdatedComponent: null,
    registeredComponents: {},
  },
};
