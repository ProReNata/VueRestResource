import HTTP from './methods';
import Rest from './http';
import helpers from './helpers';
import requestsStoreFactory from './requestsStore';
import storeBoilerplateGenerators from './Utils/storeBoilerplateGenerators';
import MODULE_NAME from './moduleName';

const mergeConfigWithDefaults = (config) => {
  const defaults = {
    logEndpoints: true,
    logInstance: true,
    vrrModuleName: MODULE_NAME || 'VRR',
    errorHandler: (err) => console.log('VRR error, logging to the console since no handler was provided.', err),
  };

  return Object.keys(config).reduce(
    (obj, key) => ({
      ...obj,
      [key]: config[key],
    }),
    defaults,
  );
};

export default {
  /**
   * Returns an object with the root HTTP class, registerResource() and all the helper functions.
   * @param {Object} customConfig 
   */
  createVueRestResource(customConfig) {
    const config = mergeConfigWithDefaults(customConfig);

    const {store, vrrModuleName} = config;
    store.registerModule(vrrModuleName, requestsStoreFactory());

    return {
      HTTP: class extends HTTP {
        constructor(resource) {
          super(resource, config);
        }
      },

      // 
      /**
       * Registers the Resource, returning a resource object.
       * Will generate the store boilerplate, unless you provide your own store or null.
       * @param {Object} resource 
       * @param {Object|undefined|null} customStore - Leaving this empty will generate the store boilerplate, unless you provide your own store then it will add the store as a module and if you pass null, it will do nothing
       * @returns an object with each model being a Rest Class
       */
      registerResource(resource, customStore = undefined) {
        // if null, we don't populate the store for you
        // If you leave it empty (thus being undefined), we will add all the models as VRR endpoints namespaced under its module name, if the module name is empty, the module won't be namespaced.
        // If you provide a store, we will add the store as a module under the global store.
        if (customStore !== null) {
          const {__name: moduleName} = resource;

          const moduleStore = customStore || {
            ...storeBoilerplateGenerators(resource),
            namespaced: moduleName !== '',
          };

          store.registerModule(moduleName, moduleStore);
        }

        return Object.keys(resource)
          .filter((k) => k[0] !== '_')
          .reduce(
            (Api, model) => ({
              ...Api,
              [model]: new Rest(resource[model], config),
            }),
            {},
          );
      },
      ...helpers(config),
    };
  },

  storeBoilerplateGenerators,
};
