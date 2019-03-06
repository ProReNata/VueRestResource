import castArray from 'lodash/castArray';
import get from 'lodash/get';

const noValueFound = {};

const getStoreResourceValue = function getStoreResourceValue(instance, asyncID, resource) {
  if (asyncID === null) {
    return null;
  }

  const {apiModule, apiModel} = resource;
  const state = instance.$store.getters[`${apiModule}/${apiModel}`] || [];

  if (Array.isArray(state)) {
    const findStatePredicate = function findStatePredicate(obj) {
      return obj.id === asyncID;
    };

    return state.find(findStatePredicate) || noValueFound;
  }

  // if (state[asyncKey] === asyncID) {
  //   return state;
  // }

  return noValueFound;
};

const getResourceValue = function getResourceValue(instance, restResources, asyncValueResolvers, relatedAsyncID) {
  if (relatedAsyncID === -1) {
    return undefined;
  }

  let resourceValue = relatedAsyncID;
  const storeValues = [];

  for (let i = 0, l = restResources.length; i < l; i += 1) {
    const asyncValueResolver = asyncValueResolvers[i];

    const storeValue = getStoreResourceValue(instance, resourceValue, restResources[i]);

    if (storeValue === noValueFound) {
      // we need a setTimeout here so the values/getters this method calls don't get logged by computed properties
      // and so don't get registered as dependencies to react on
      const action = get(restResources[i], 'resource.remoteAction') ? 'remoteAction' : 'get';
      setTimeout(() => restResources[i][action](resourceValue), 1);

      // resource not loaded yet,
      // the computed function will be called again when store is updated
      return undefined;
    }

    storeValues.push(storeValue);

    // re-assign resourceValue to be applied as next foreign key
    resourceValue = asyncValueResolver(storeValue, noValueFound, storeValues);
  }

  return resourceValue;
};

const pathIteratee = function pathIteratee(obj, key, i) {
  if (key === 'this' && i === 0) return obj;
  return obj[key] || noValueFound;
};

export default {
  // use as `...asyncResourceGetter(name, Resource, Resolvers, id)` in the components computed properties
  asyncResourceGetter(computedPropertyName, restResources, initialId, resolverFunctions = (data) => data) {
    return {
      [computedPropertyName]() {
        // get the needed values from object nested (or not) paths in `this`
        const [asyncValueResolvers, relatedAsyncID] = [resolverFunctions, initialId].map((value) => {
          if (typeof value !== 'string') {
            return value;
          }

          return value.split('.').reduce(pathIteratee, this);
        });

        return getResourceValue(this, castArray(restResources), castArray(asyncValueResolvers), relatedAsyncID);
      },
    };
  },
  // use as `...asyncResourceValue` in the components computed properties
  asyncResourceValue: {
    asyncResourceValue() {
      const {restResources, relatedAsyncID, asyncValueResolver} = this;

      return getResourceValue(this, castArray(restResources), castArray(asyncValueResolver), relatedAsyncID);
    },
  },

  /**
   * Updates the store with a list based on a relation of keys.
   *
   * @param {string} watcherPropertyName - Of computed property,.
   * @param {boolean} immediate - Run directly on page load.
   * @param {Object[] | Object} resources - The model to use.
   * @param {string[] | string} [resourceRelatedKeys=id] - Key to look for in the database.
   * @param {string} [verificationKey] - No idea.
   *
   * @returns {Object} - Places a watcher property with the values in your state.
   */
  // PROBABLY WILL BE DEPRECATED / REWRITEN
  updateResourceListWatcher(watcherPropertyName, immediate, resources, resourceRelatedKeys = 'id', verificationKey) {
    return {
      [watcherPropertyName]: {
        immediate,
        handler(updatedValue, oldValue) {
          if (typeof updatedValue === 'undefined' && !immediate) {
            return;
          }

          const updated = updatedValue && typeof verificationKey !== 'undefined' ? updatedValue[verificationKey] : updatedValue;
          const outdated = oldValue && typeof verificationKey !== 'undefined' ? oldValue[verificationKey] : oldValue;
          const resourceMatches = (outdated && updated === outdated) || (updatedValue && !oldValue);

          if (resourceMatches) {
            const resourceIteratee = function resourceIteratee(resource, i) {
              const resourceKey = Array.isArray(resourceRelatedKeys) ? resourceRelatedKeys[i] : resourceRelatedKeys;

              setTimeout(() => {
                resource.list({
                  [resourceKey]: updated,
                });
              }, 1);
            };

            castArray(resources)
              .map((resource) => this[resource])
              .forEach(resourceIteratee);
          }
        },
      },
    };
  },
  // resourceListGetter('students', Patients, {school: 20, class: 'A'}) {
  // resourceListGetter('seenhints', SeenHints, [1, 2, 4]) {
  resourceListGetter(computedPropertyName, resource, pathToInitialValues) {
    console.log('Creating List', computedPropertyName);

    return {
      [computedPropertyName]() {
        const computed = pathToInitialValues.split('.').reduce(pathIteratee, this);
        console.log('Inside List', computed);

        if (Array.isArray(computed)) {
          const ids = computed || [];

          const resourceValues = ids.map((id) => getStoreResourceValue(this, id, resource));
          const allValuesInStore = resourceValues.every((value) => value !== noValueFound);
          console.log('Inside List 2', allValuesInStore, computed.join(','));

          if (allValuesInStore) {
            return resourceValues;
          }

          // do server request
          // NEEDS TO BE IMPLEMENTED ON SERVER
          resource.list({id: computed.join(',')});
        } else {
          resource.list(computed);
        }

        return [];
      },
    };
  },
};
