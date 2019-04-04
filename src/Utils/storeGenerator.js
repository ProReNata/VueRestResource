import mergeById from 'HTTP/Utils/mergeById';
import filterDuplicatesById from 'HTTP/Utils/filterDuplicatesById';
import propertyAction from 'HTTP/Utils/propertyAction';

const defaultActions = Object.freeze(['list', 'get', 'post', 'delete']);

export default {
  actions(resourceName, actionsToRegister = defaultActions) {
    const storeActions = {
      delete: ({commit, state}, id) => {
        commit(resourceName, state[resourceName].filter((entry) => entry.id !== id));
      },
      get: ({commit, state}, data) => {
        commit(resourceName, mergeById(state[resourceName], data));
      },
      list: ({commit, state}, data) => {
        commit(resourceName, data.concat(state[resourceName]).filter(filterDuplicatesById));
      },
      post: ({commit, state}, data) => {
        commit(resourceName, mergeById(state[resourceName], data));
      },
    };

    return actionsToRegister.reduce(
      (storeEntries, action) => ({
        ...storeEntries,
        [propertyAction(action, resourceName)]: storeActions[action],
      }),
      {},
    );
  },
  getters(resourceName) {
    return {
      [resourceName](state) {
        return state[resourceName];
      },
    };
  },
  mutations(resourceName) {
    return {
      [resourceName](state, arr) {
        state[resourceName] = arr;
      },
    };
  },
};
