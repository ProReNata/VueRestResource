import noop from 'lodash/noop';

const actions = {
  init: noop,
  registerComponentInStore(store, instance) {
    if (store.getters.registeredComponents.get(instance)) {
      // its already there, lets not override it
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
  unregisterRequest(store, req) {
    store.commit('unregisterRequest', req);
  },
  updateRequest(store, req) {
    store.commit('updateRequest', req);
  },
};

const mutations = {
  registerComponent(state, instance) {
    state.registeredComponents.set(instance, []);
  },
  registerRequest(state, request) {
    const {logEndpoints, logInstance, endpoint, callerInstance} = request;

    // register by component instance
    if (logInstance) {
      const instanceRequests = state.registeredComponents.get(callerInstance);

      if (!instanceRequests) {
        console.info('VRR: the instance is not registered yet');
      }

      const requestList = instanceRequests.concat({...request});
      state.registeredComponents.set(callerInstance, requestList);
    }

    // register by endpoint
    if (logEndpoints) {
      const currentOpenRequestsToEndpoint = state.activeRequestsToEndpoint[endpoint] || [];
      state.activeRequestsToEndpoint = {
        ...state.activeRequestsToEndpoint,
        [endpoint]: currentOpenRequestsToEndpoint.concat(request),
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
    const {id, endpoint, callerInstance} = request;

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

    // update component endpoint list
    const instanceRequests = state.registeredComponents.get(callerInstance);

    if (instanceRequests) {
      const removeIdIterator = function removeIdIterator(req) {
        return req.id !== id;
      };

      const requestList = instanceRequests.filter(removeIdIterator);
      state.registeredComponents.set(callerInstance, requestList);
    }
  },
  updateRequest(state, request) {
    const {id, logInstance, logEndpoints, endpoint, callerInstance} = request;

    state.lastUpdatedComponent = callerInstance;

    const requestUpdateIterator = function requestUpdateIterator(req) {
      const updatedRequest = id === req.id ? request : req;

      return updatedRequest;
    };

    // Since we cannot use listener for complex/nested objects
    // we use a shallow state key that triggers listeners in components
    // and they can check if the change is related to them or ignore the call

    // update the component instance list
    const instanceRequests = state.registeredComponents.get(callerInstance);

    if (logInstance) {
      if (instanceRequests) {
        // sometimes we have removed the component before the request is updated
        // in such cases we should not re-add the instance to the list

        const requestList = (instanceRequests || []).map(requestUpdateIterator);
        state.registeredComponents.set(callerInstance, requestList);
      }
    }

    // update the endpoint list
    if (logEndpoints) {
      const current = state.activeRequestsToEndpoint[endpoint];

      if (!current) {
        console.info('VRR: store mutations > updateRequest: Request not found in store');

        return;
      }

      const requestList = current.map(requestUpdateIterator);

      state.activeRequestsToEndpoint = {
        ...state.activeRequestsToEndpoint,
        [endpoint]: requestList,
      };
    }
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
