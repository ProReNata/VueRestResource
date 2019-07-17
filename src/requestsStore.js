import noop from 'lodash/noop';

const actions = {
  init: noop,
  registerComponentInStore(store, instance) {
    if (store.getters.registeredComponents.get(instance)) {
      return;
    }
    instance.$once('hook:beforeDestroy', () => {
      store.commit('unregisterComponent', instance);
    });
    store.commit('registerComponent', instance);
  },
  registerRequest(store, req) {
    store.commit('registerRequest', req);
  },
  unregisterComponentInStore(store, instance) {
    store.commit('unregisterComponent', instance);
  },
  unregisterRequest(store, ref) {
    store.commit('unregisterRequest', ref);
  },
  updateRequest(store, req) {
    store.commit('updateRequest', req);
  },
};

const mutations = {
  registerComponent(state, instance) {
    state.registeredComponents.set(instance, []);
  },
  registerRequest(state, {logEndpoints, logInstance, request, callerInstance}) {
    // register by component instance
    if (logInstance) {
      const instanceRequests = state.registeredComponents.get(callerInstance) || [];
      const requestList = instanceRequests.concat({...request});
      state.registeredComponents.set(callerInstance, requestList);
    }

    // register by endpoint
    if (logEndpoints) {
      const current = state.activeRequestsToEndpoint[request.endpoint] || [];
      state.activeRequestsToEndpoint = {
        ...state.activeRequestsToEndpoint,
        [request.endpoint]: current.concat(request),
      };
    }
  },
  unregisterComponent(state, instance) {
    if (!state.registeredComponents.get(instance)) {
      throw new Error('component not registered');
    }

    state.registeredComponents.set(instance, null); // maybe redundant but the idea is to help clearing memory
    state.registeredComponents.delete(instance);
    if (state.lastUpdatedComponent === instance) {
      state.lastUpdatedComponent = null;
    }
  },
  unregisterRequest(state, request) {
    const {id, endpoint} = request;

    // unregister endpoint
    const activeRequestsToEndpointPredicate = function activeRequestsToEndpointPredicate(req) {
      return req.id !== id;
    };

    const activeRequests = state.activeRequestsToEndpoint[endpoint] || [];

    const others = activeRequests.filter(activeRequestsToEndpointPredicate);
    state.activeRequestsToEndpoint = {
      ...state.activeRequestsToEndpoint,
      [endpoint]: others,
    };
  },
  updateRequest(state, req) {
    return;

    // Since we cannot use listener for complex/nested objects
    // we use a shallow state key that triggers listeners in components
    // and they can check if the change is related to them or ignore the call
    state.lastUpdatedComponent = req.logInstance;
    const componentRequests = state.registeredComponents.get(req.logInstance) || [];
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

export default () => ({
  actions,
  getters,
  mutations,
  namespaced: true,
  state: {
    activeRequestsToEndpoint: {},
    lastUpdatedComponent: null,
    registeredComponents: new Map(),
  },
});
