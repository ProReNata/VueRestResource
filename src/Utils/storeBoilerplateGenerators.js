import propertyAction from './propertyAction';
import filterDuplicatesById from './filterDuplicatesById';
import mergeById from './mergeById';

export default (resource) => {
  const modules = Object.keys(resource)
    .filter((k) => k[0] !== '_')
    .map((key) => resource[key].apiModel);

  const actions = modules.reduce(
    (obj, name) => ({
      ...obj,
      [propertyAction('list', name)]({state, commit}, list) {
        commit(name, list.concat(state[name]).filter(filterDuplicatesById));
      },
      [propertyAction('get', name)]({state, commit}, data) {
        commit(name, mergeById(state[name], data));
      },
      [propertyAction('put', name)]({state, commit}, data) {
        commit(name, mergeById(state[name], data));
      },
      [propertyAction('post', name)]({state, commit}, data) {
        commit(name, mergeById(state[name], data));
      },
      [propertyAction('delete', name)]({state, commit}, id) {
        commit(
          name,
          state[name].filter((entry) => entry.id !== id),
        );
      },
    }),
    {},
  );

  const mutations = modules.reduce(
    (obj, name) => ({
      ...obj,
      [name](state, arr) {
        state[name] = arr;
      },
    }),
    {},
  );

  const getters = modules.reduce(
    (obj, name) => ({
      ...obj,
      [name](state) {
        return state[name];
      },
    }),
    {},
  );

  const state = modules.reduce(
    (obj, name) => ({
      ...obj,
      [name]: [],
    }),
    {},
  );

  return {
    actions,
    getters,
    mutations,
    state,
  };
};
