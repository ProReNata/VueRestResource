import noop from 'lodash/noop';
import componentRegisterMap from './componentRegisterMap';

export default () => {
  const actions = {
    init: noop,
    registerRequest(store, req) {
      store.commit('registerRequest', req);
    },
    unregisterRequest(store, req) {
      store.commit('unregisterRequest', req);
    },
    updateRequest(store, req) {
      store.commit('updateRequest', req);
    },
    deleteInstance(store, req) {
      store.commit('deleteInstance', req);
    },
  };

  const mutations = {
    deleteInstance(state, instanceUUID) {
      componentRegisterMap.delete(instanceUUID);
      const tempState = {
        ...state.activeRequestsFromComponent,
        [instanceUUID]: null,
      };

      delete tempState[instanceUUID];

      state.activeRequestsFromComponent = tempState;
    },
    registerRequest(state, request) {
      const {logEndpoints, logInstance, endpoint, callerInstance} = request;
      delete request.callerInstance; // Avoid saving the instance, which includes a circular reference, in Vuex

      // register by component instance
      if (logInstance) {
        const instanceRequests = state.activeRequestsFromComponent[callerInstance] || [];
        state.activeRequestsFromComponent[callerInstance] = instanceRequests.concat({...request});
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
    unregisterRequest(state, request) {
      const {id, endpoint, callerInstance} = request;
      const activeRequests = state.activeRequestsToEndpoint[endpoint] || [];
      const others = activeRequests.filter((req) => req.id !== id);

      state.activeRequestsToEndpoint = {
        ...state.activeRequestsToEndpoint,
        [endpoint]: others,
      };

      // update component request list
      const instanceRequests = state.activeRequestsFromComponent[callerInstance];

      if (instanceRequests) {
        state.activeRequestsFromComponent = {
          ...state.activeRequestsFromComponent,
          [callerInstance]: instanceRequests.filter((req) => req.id !== id),
        };
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
        const instanceRequests = state.activeRequestsFromComponent[callerInstance];

        state.lastUpdatedComponentId = callerInstance;

        if (instanceRequests) {
          // sometimes we have removed the component before the request is updated
          // in such cases we should not re-add the instance to the list

          state.activeRequestsFromComponent = {
            ...state.activeRequestsFromComponent,
            [callerInstance]: (instanceRequests || []).map(requestUpdateIterator),
          };
        } else {
          state.activeRequestsFromComponent = {
            ...state.activeRequestsFromComponent,
            [callerInstance]: (instanceRequests || []).concat(request),
          };
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
    activeRequestsFromComponent(state) {
      return state.activeRequestsFromComponent;
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
      activeRequestsFromComponent: {},
    },
  };
};
