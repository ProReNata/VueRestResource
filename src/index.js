import HTTP from './methods';
import Rest from './http';
import helpers from './helpers';
import requestsStore from './requestsStore';
import storeBoilerplateGenerators from './Utils/storeBoilerplateGenerators';
import MODULE_NAME from './moduleName';

const mergeOptions = (original) => {
  const defaults = {
    logEndpoints: true,
    logInstance: true,
    vrrModuleName: MODULE_NAME,
  };

  return Object.keys(original).reduce(
    (obj, key) => ({
      ...obj,
      [key]: original[key],
    }),
    defaults,
  );
};

export default {
  createVueRestResource(config) {
    const options = mergeOptions(config);

    const {store, vrrModuleName = MODULE_NAME} = options;
    store.registerModule(vrrModuleName, requestsStore);

    return {
      HTTP: class extends HTTP {
        constructor(resource) {
          super(resource, options);
        }
      },

      registerResource(resource, customStore) {
        // if null, we turn it off on purpose
        if (customStore !== null) {
          const moduleStore = customStore || {
            ...storeBoilerplateGenerators(resource),
          };

          const {__name: moduleName} = resource;
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
    };
  },
  ...helpers,
  storeBoilerplateGenerators,
};
