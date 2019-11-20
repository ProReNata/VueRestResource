import noop from 'lodash/noop';

export default () => {
  let indexCounter = 0;
  const componentRegisterMap = new Map();

  const actions = {
    init: noop,
    registerComponentInStore(store, instance) {
      if (componentRegisterMap.get(instance)) {
        // its already there, lets not override it
        return;
      }

      if (instance && instance.$once) {
        instance.$once('hook:beforeDestroy', () => {
          store.commit('unregisterComponent', instance);
        });
      }

      const nextIndex = indexCounter + 1;
      indexCounter = nextIndex;
      const instanceId = nextIndex;
      store.commit('registerComponent', {instance, instanceId});
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
    registerComponent(state, {instance, instanceId}) {
      componentRegisterMap.set(instance, instanceId);

      state.registeredComponents = {
        ...state.registeredComponents,
        [instanceId]: [],
      };
    },
    registerRequest(state, request) {
      const {logEndpoints, logInstance, endpoint, callerInstance} = request;
      delete request.callerInstance; // Avoid saving the instance, which includes a circular reference, in Vuex

      // register by component instance
      if (logInstance) {
        const instanceId = componentRegisterMap.get(callerInstance);
        const instanceRequests = state.registeredComponents[instanceId];

        if (!instanceRequests) {
          console.info('VRR: the instance is not registered yet');
        }

        state.registeredComponents[instanceId] = instanceRequests.concat({...request});
      }

      // register by endpoint
      if (logEndpoints) {
        const currentOpenRequestsToEndpoint = state.activeRequestsToEndpoint[endpoint] || [];
        state.activeRequestsToEndpoint = {
          ...state.activeRequestsToEndpoint,
          [endpoint]: currentOpenRequestsToEndpoint.concat({...request}),
        };
      }
    },
    unregisterComponent(state, instance) {
      if (!componentRegisterMap.get(instance)) {
        throw new Error('component not registered');
      }

      const instanceId = componentRegisterMap.get(instance);
      componentRegisterMap.set(instance, null); // maybe redundant but the idea is to help clearing memory
      componentRegisterMap.delete(instance);
      state.registeredComponents[instanceId] = null;
      delete state.registeredComponents[instanceId];

      if (state.lastUpdatedComponentId === instanceId) {
        state.lastUpdatedComponentId = null;
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
      const instanceId = componentRegisterMap.get(callerInstance);
      const instanceRequests = state.registeredComponents[instanceId];

      if (instanceRequests) {
        const removeIdIterator = function removeIdIterator(req) {
          return req.id !== id;
        };

        state.registeredComponents[instanceId] = instanceRequests.filter(removeIdIterator);
      }
    },
    updateRequest(state, request) {
      const {id, logInstance, logEndpoints, endpoint, callerInstance} = request;
      delete request.callerInstance; // Avoid saving the instance, which includes a circular reference, in Vuex

      function requestUpdateIterator(req) {
        const updatedRequest = id === req.id ? request : req;

        return updatedRequest;
      }

      // Since we cannot use listener for complex/nested objects
      // we use a shallow state key that triggers listeners in components
      // and they can check if the change is related to them or ignore the call

      if (logInstance) {
        // update the component instance list
        const instanceId = componentRegisterMap.get(callerInstance);
        const instanceRequests = state.registeredComponents[instanceId];

        state.lastUpdatedComponentId = instanceId;

        if (instanceRequests) {
          // sometimes we have removed the component before the request is updated
          // in such cases we should not re-add the instance to the list

          state.registeredComponents[instanceId] = (instanceRequests || []).map(requestUpdateIterator);
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
      const componentId = state.lastUpdatedComponentId;

      return componentRegisterMap.get(componentId); // Component instance
    },
    registeredComponents(state) {
      const register = new Map();
      const instanceRequests = state.registeredComponents;
      componentRegisterMap.forEach((instanceId, instance) => {
        register.set(instance, instanceRequests[instanceId]);
      });

      return register;
    },
  };

  return {
    actions,
    getters,
    mutations,
    namespaced: true,
    state: {
      activeRequestsToEndpoint: {},
      lastUpdatedComponentId: null,
      registeredComponents: {},
    },
  };
};
