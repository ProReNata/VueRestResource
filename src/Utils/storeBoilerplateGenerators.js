import propertyAction from './propertyAction';
import filterDuplicatesById from './filterDuplicatesById';
import mergeById from './mergeById';

/**
 * Loops over each model and adds the actions needed for VRR.
 *
 * @param {object} resource - A Module object.
 * @returns {object} Actions, mutations, getters and setters to be used in a store.
 */
export default function putModelsInStore(resource) {
  // Puts all models in an Array (Endpoints)
  const models = Object.keys(resource)
    .filter((k) => k[0] !== '_') // Filters out the Module '__name' in this object
    .map((key) => resource[key].apiModel);

  const actions = models.reduce(
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

  const mutations = models.reduce(
    (obj, name) => ({
      ...obj,
      [name](state, value) {
        state[name] = value;
      },
    }),
    {},
  );

  const getters = models.reduce(
    (obj, name) => ({
      ...obj,
      [name](state) {
        return state[name];
      },
    }),
    {},
  );

  const state = models.reduce(
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
}
