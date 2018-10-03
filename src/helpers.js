const noValueFound = {};
const arrayFrom = (identity) => (Array.isArray(identity) ? identity : [identity]);

const getStoreResourceValue = (instance, asyncID, asyncKey, resource) => {
  if (asyncID === null) {
    return null;
  }

  const {apiModule, apiModel} = resource;
  const state = instance.$store.getters[`${apiModule}/${apiModel}`] || [];

  if (Array.isArray(state)) {
    return state.find((obj) => obj[asyncKey] === asyncID) || noValueFound;
  }

  if (state[asyncKey] === asyncID) {
    return state;
  }

  return noValueFound;
};

const getResourceValue = (instance, RestResources, AsyncValueResolvers, relatedAsyncID, asyncKeys) => {
  if (relatedAsyncID === -1) {
    return undefined;
  }

  let resourceValue = relatedAsyncID;

  for (let i = 0, l = RestResources.length; i < l; i += 1) {
    const asyncKey = asyncKeys[i];
    const asyncValueResolver = AsyncValueResolvers[i];

    const storeValue = getStoreResourceValue(instance, resourceValue, asyncKey, RestResources[i]);

    if (storeValue === noValueFound) {
      // we need a setTimeout here so the values/getters this method calls don't get logged by computed properties
      // and so don't get registered as dependencies to react on
      setTimeout(() => RestResources[i].get(resourceValue), 1);

      // resource not loaded yet,
      // the computed function will be called again when store is updated
      return undefined;
    }

    // re-assign resourceValue to be applied as next foreign key
    resourceValue = asyncValueResolver(storeValue, noValueFound);
  }

  return resourceValue;
};

export default {
  // use as `...asyncResourceGetter(name, Resource, Resolvers, id)` in the components computed properties
  asyncResourceGetter(computedPropertyName, RestResourcesPath, AsyncValueResolversPath, relatedAsyncIDPath, asyncKeyPath) {
    return {
      [computedPropertyName]() {
        // get the needed values from object nested (or not) paths in `this`
        const [RestResources, AsyncValueResolvers, relatedAsyncID, asyncKey] = [
          RestResourcesPath,
          AsyncValueResolversPath,
          relatedAsyncIDPath,
          asyncKeyPath,
        ].map((path) => {
          if (typeof path !== 'string') {
            return path;
          }

          return path.split('.').reduce((obj, key) => obj[key] || {}, this);
        });

        return getResourceValue(this, arrayFrom(RestResources), arrayFrom(AsyncValueResolvers), relatedAsyncID, asyncKey);
      },
    };
  },
  // use as `...asyncResourceValue` in the components computed properties
  asyncResourceValue: {
    asyncResourceValue() {
      const {RestResources, relatedAsyncID, AsyncValueResolver, asyncKey} = this;

      return getResourceValue(this, arrayFrom(RestResources), arrayFrom(AsyncValueResolver), relatedAsyncID, asyncKey);
    },
  },
  updateResourceListWatcher(watcherPropertyName, immediate, resources, resourceRelatedKeys, verificationKey) {
    return {
      [watcherPropertyName]: {
        immediate,
        handler(updatedValue, oldValue) {
          const self = this;

          if (typeof updatedValue === 'undefined' && !immediate) {
            return;
          }

          const updated = updatedValue && typeof verificationKey !== 'undefined' ? updatedValue[verificationKey] : updatedValue;
          const outdated = oldValue && typeof verificationKey !== 'undefined' ? oldValue[verificationKey] : oldValue;
          const resourceMatches = (outdated && updated === outdated) || (updatedValue && !oldValue);

          if (resourceMatches) {
            arrayFrom(resources)
              .map((resource) => self[resource])
              .forEach((resource, i) => {
                const resourceKey = Array.isArray(resourceRelatedKeys) ? resourceRelatedKeys[i] : resourceRelatedKeys;
                setTimeout(() => {
                  resource.list({
                    [resourceKey]: updated,
                  });
                }, 1);
              });
          }
        },
      },
    };
  },
};
