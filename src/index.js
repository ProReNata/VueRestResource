import createUUID from 'uuid/v4';
import HTTP from './methods';
import Rest from './http';
import helpers from './helpers';
import requestsStore from './requestsStore';
import storeBoilerplateGenerators from './Utils/storeBoilerplateGenerators';
import MODULE_NAME from './moduleName';

export default {
  createVueRestResource(config) {
    const {store, vrrModuleName = MODULE_NAME} = config;
    store.registerModule(vrrModuleName, requestsStore);

    return {
      HTTP: class extends HTTP {
        constructor(resource) {
          super(resource, config);
        }
      },

      registerResource(resources, customStore) {

        const moduleStore = customStore || {
          ...storeBoilerplateGenerators(resources),
        };
        const {__name: moduleName} = resources;
        store.registerModule(moduleName, moduleStore);

        return Object.keys(resources)
          .filter((k) => k[0] !== '_')
          .map((resource) => new Rest(uuid, resource, config));
      },
    };
  },
  ...helpers,
  storeBoilerplateGenerators,
};
