import propertyAction from 'Global/Store/Utils/propertyAction';
import filterDuplicatesById from 'Global/Store/Utils/filterDuplicatesById';
import mergeById from 'Global/Store/Utils/mergeById';

export default (resource) => {
  const modules = Object.keys(resource)
    .filter((k) => {
      return k[0] !== '_';
    })
    .map((key) => {
      return resource[key].apiModel;
    });

  const actions = modules.reduce((obj, name) => {
    return {
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
    };
  }, {});

  const mutations = modules.reduce((obj, name) => {
    return {
      ...obj,
      [name](state, arr) {
        state[name] = arr;
      },
    };
  }, {});

  const getters = modules.reduce((obj, name) => {
    return {
      ...obj,
      [name](state) {
        return state[name];
      },
    };
  }, {});

  const state = modules.reduce((obj, name) => {
    return {
      ...obj,
      [name]: [],
    };
  }, {});

  return {
    actions,
    getters,
    mutations,
    state,
  };
};
