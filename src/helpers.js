import castArray from 'lodash/castArray';
import get from 'lodash/get';
import componentRegisterMap from './componentRegisterMap';

const getStorePath = (resource) => {
  const {apiModule, apiModel} = resource;

  return [apiModule, apiModel].filter(Boolean).join('/');
};

const getStateForResource = (instance, resource) => {
  const storePath = getStorePath(resource);

  return instance.$store.getters[storePath] || [];
};

const noValueFound = {};

const getStoreResourceValue = function getStoreResourceValue(instance, asyncID, resource) {
  if (asyncID === null) {
    return null;
  }

  const state = getStateForResource(instance, resource);

  if (Array.isArray(state)) {
    const findStatePredicate = function findStatePredicate(obj) {
      return obj.id === asyncID;
    };

    const value = state.find(findStatePredicate);

    return value || noValueFound;
  }

  // if (state[asyncKey] === asyncID) {
  //   return state;
  // }

  return noValueFound;
};

const getStoreResourceValueByKeys = function getStoreResourceValueByKeys(instance, filter, resource) {
  if (filter === null) {
    return null;
  }

  const state = getStateForResource(instance, resource);

  if (Array.isArray(state)) {
    const findStatePredicate = function findStatePredicate(obj) {
      const keys = Object.keys(filter);

      return keys.every((key) => obj[key] === filter[key]);
    };

    const value = state.filter(findStatePredicate);

    return value || noValueFound;
  }

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
      setTimeout(() => restResources[i][action](instance, resourceValue), 1);

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
  if (key === 'this' && i === 0) {
    return obj;
  }

  return obj[key] || noValueFound;
};

export default (options) => {
  return {
    /**
     * Loads in the specific object in the store.
     * Use this to bind a state to a computed property.
     * If the Object is not found in the store, it fills the store with data from the server.
     *
     * Use as `...asyncResourceGetter(name, Resource, id)` in the components computed properties.
     * To get a nested object: `...asyncResourceGetter(name, [ResourceA, ResourceB], id, [(dataResourceA) => data.IdToPassToResourceB, (dataResourceB) => data])` in the components computed properties.
     *
     * @param {string} computedPropertyName - Name of the computed property that will be created.
     * @param {object[]|object} restResources - The model to use.
     * @param {string | number} initialId -  The computed property, or prop, with/or the `id` of the object you want or the name of the instance value/property to observe.
     * @param {Function} resolverFunctions - Callback to transform the data from the store before providing it as the value of the computed property. If you don't need it just pass `(data) => data`.
     *
     * @returns {object} - Places a computed property with the values in your state.
     */
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

    activeRequests(computedPropertyName = 'activeRequests') {
      const emptyArray = [];

      return {
        [computedPropertyName]() {
          const instanceUUID = componentRegisterMap.add(this);
          const {vrrModuleName} = options;
          const requests = this.$store.state[vrrModuleName].activeRequestsFromComponent;

          return requests[instanceUUID] || emptyArray;
        },
      };
    },

    // PROBABLY WILL BE DEPRECATED / REWRITEN
    updateResourceListWatcher(watcherPropertyName, immediate, resources, resourceRelatedKeys = 'id', verificationKey) {
      return {
        [watcherPropertyName]: {
          immediate,
          handler(updatedValue, oldValue) {
            if (typeof updatedValue === 'undefined' && !immediate) {
              return;
            }

            const callerInstance = this;

            const updated = updatedValue && typeof verificationKey !== 'undefined' ? updatedValue[verificationKey] : updatedValue;
            const outdated = oldValue && typeof verificationKey !== 'undefined' ? oldValue[verificationKey] : oldValue;
            const resourceMatches = (outdated && updated === outdated) || (updatedValue && !oldValue);

            if (resourceMatches) {
              const resourceIteratee = function resourceIteratee(resource, i) {
                const resourceKey = Array.isArray(resourceRelatedKeys) ? resourceRelatedKeys[i] : resourceRelatedKeys;

                setTimeout(() => {
                  resource.list(callerInstance, {
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

    /**
     * Updates the store with a list based on a relation of keys.
     *
     * Use: resourceListGetter('students', Patients, {school: 20, class: 'A'}).
     * Use: resourceListGetter('seenhints', SeenHints, [1, 2, 4]).
     *
     * @param {string} computedPropertyName - Name of the computed property that will be created.
     * @param {object[]|object} resource - The model to use.
     * @param {string[]|object[]} pathToInitialValues - The computed property name that has a array with IDs or a object to be used as a filter for the query.
     *
     * @returns {object} - Places a computed property with the values in your state.
     */
    resourceListGetter(computedPropertyName, resource, pathToInitialValues) {
      const emptyArray = [];

      return {
        [computedPropertyName]() {
          const callerInstance = this;
          const computed = pathToInitialValues.split('.').reduce(pathIteratee, callerInstance);

          if (computed === noValueFound) {
            return emptyArray;
          }

          const isArray = Array.isArray(computed);
          const isObject = computed instanceof Object && !isArray;

          let allValuesInStore = false;
          let resourceValues = [noValueFound];

          if (isObject) {
            resourceValues = getStoreResourceValueByKeys(this, computed, resource);
            allValuesInStore = resourceValues.some((value) => value !== noValueFound);
          }

          if (isArray) {
            const ids = isArray ? computed || [] : castArray(computed);
            resourceValues = ids.map((id) => getStoreResourceValue(this, id, resource));
            allValuesInStore = resourceValues.every((value) => value !== noValueFound);
          }

          if (allValuesInStore) {
            if (isArray) {
              return resourceValues;
            }

            return resourceValues[0] === noValueFound ? emptyArray : resourceValues;
          }

          // do server request
          setTimeout(() => {
            resource.list(callerInstance, isArray ? {id: castArray(computed).join(',')} : computed);
          }, 1);

          return emptyArray;
        },
      };
    },
  };
};
