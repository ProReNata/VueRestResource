import castArray from 'lodash/castArray';
import get from 'lodash/get';

const noValueFound = {};

const getStoreResourceValue = function getStoreResourceValue(instance, asyncID, asyncKey, resource) {
  if (asyncID === null) {
    return null;
  }

  const {apiModule, apiModel} = resource;
  const state = instance.$store.getters[`${apiModule}/${apiModel}`] || [];

  if (Array.isArray(state)) {
    const findStatePredicate = function findStatePredicate(obj) {
      return obj[asyncKey] === asyncID;
    };

    return state.find(findStatePredicate) || noValueFound;
  }

  if (state[asyncKey] === asyncID) {
    return state;
  }

  return noValueFound;
};

const getResourceValue = function getResourceValue(instance, restResources, asyncValueResolvers, relatedAsyncID, asyncKeys) {
  if (relatedAsyncID === -1) {
    return undefined;
  }

  let resourceValue = relatedAsyncID;
  const storeValues = [];

  for (let i = 0, l = restResources.length; i < l; i += 1) {
    const asyncKey = asyncKeys[i];
    const asyncValueResolver = asyncValueResolvers[i];

    const storeValue = getStoreResourceValue(instance, resourceValue, asyncKey, restResources[i]);

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

const pathIteratee = function pathIteratee(obj, key) {
  return obj[key] || {};
};

export default {
  // use as `...asyncResourceGetter(name, Resource, Resolvers, id)` in the components computed properties
  asyncResourceGetter(computedPropertyName, restResourcesPath, asyncValueResolversPath, relatedAsyncIDPath, asyncKeyPath) {
    return {
      [computedPropertyName]() {
        // get the needed values from object nested (or not) paths in `this`
        const [restResources, asyncValueResolvers, relatedAsyncID, asyncKey] = [
          restResourcesPath,
          asyncValueResolversPath,
          relatedAsyncIDPath,
          asyncKeyPath,
        ].map((path) => {
          if (typeof path !== 'string' || !path.match(/\./)) {
            return path;
          }

          return path.split('.').reduce(pathIteratee, this);
        });

        return getResourceValue(this, castArray(restResources), castArray(asyncValueResolvers), relatedAsyncID, asyncKey);
      },
    };
  },
  // use as `...asyncResourceValue` in the components computed properties
  asyncResourceValue: {
    asyncResourceValue() {
      const {restResources, relatedAsyncID, asyncValueResolver, asyncKey} = this;

      return getResourceValue(this, castArray(restResources), castArray(asyncValueResolver), relatedAsyncID, asyncKey);
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
  resourceListGetter(computedPropertyName, resource, initialValues, keyName) {
    return {
      [computedPropertyName]() {
        const values = (() => {
          const computed = initialValues.split('.').reduce((obj, key) => obj[key] || noValueFound, this);

          return computed !== noValueFound ? castArray(computed) : [];
        })();

        const handlers = values.map(() => (data) => data);
        const resourceValues = values
          .map((value) => getResourceValue(this, [resource], handlers, value, castArray(keyName)))
          .filter((val) => typeof val !== 'undefined');

        return resourceValues.length === values.length && values.length > 0 ? resourceValues : [];
      },
    };
  },
};
