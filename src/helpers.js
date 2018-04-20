
const noValueFound = {};
const arrayFrom = (identity) => Array.isArray(identity) ? identity : [identity];

const getResourceValue = function(RestResources, AsyncValueResolvers, relatedAsyncID){
  if (relatedAsyncID === -1) return;
  let resourceValue = relatedAsyncID;

  for (let i = 0, l = RestResources.length; i < l; i++) {
    const asyncKey = this.asyncKey[i];
    const AsyncValueResolver = AsyncValueResolvers[i];

    const storeValue = getStoreResourceValue.call(
      this, resourceValue, asyncKey, RestResources[i],
    );

    if (storeValue === noValueFound) {
      // we need a setTimeout here so the values/getters this method calls don't get loggedby computed properties
      // and so don't get registered as dependencies to react on
      setTimeout(() => RestResources[i].get(resourceValue), 1);

      // resource not loaded yet,
      // the computed function will be called again when store is updated
      return;
    }

    // re-assign resourceValue to be applied as next foreign key
    resourceValue = AsyncValueResolver(storeValue, noValueFound);
  }
  return resourceValue;
};

const getStoreResourceValue = function(asyncID, asyncKey, resource){
  if (asyncID === null) return null;
  const {apiModule, apiModel} = resource;
  const state = this.$store.getters[`${apiModule}/${apiModel}`] || [];

  if (Array.isArray(state)) {
    return state.find(obj => obj[asyncKey] === asyncID) || noValueFound;
  } else if (state[asyncKey] === asyncID) {
    return state;
  }
  return noValueFound;
};


export default {
  // use as `...asyncResourceValue` in the components computed properties
  asyncResourceValue: {
    asyncResourceValue: function(){
      const {RestResources, relatedAsyncID, AsyncValueResolver} = this;
      return getResourceValue.call(this, arrayFrom(RestResources), arrayFrom(AsyncValueResolver), relatedAsyncID);
    }
  },
  // use as `...asyncResourceGetter(name, Resource, Resolvers, id)` in the components computed properties
  asyncResourceGetter: function(computedPropertyName, RestResourcesPath, AsyncValueResolversPath, relatedAsyncIDPath){
    return {
      [computedPropertyName]: function(){
        // get the needed values from object nested (or not) paths in `this`
        const [RestResources, AsyncValueResolvers, relatedAsyncID] = [RestResourcesPath, AsyncValueResolversPath, relatedAsyncIDPath].map(path => {
          return path.split('.').reduce((obj, key) => obj[key] || {}, this);
        });

        return getResourceValue.call(this, RestResources, AsyncValueResolvers, relatedAsyncID);
      }
    }
  }
}
