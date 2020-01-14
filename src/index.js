import createUUID from 'uuid/v4';
import HTTP from './methods';
import Rest from './http';
import helpers from './helpers';
import requestsStore from './requestsStore';
import MODULE_NAME from './moduleName';

export default function createVueRestResource(config) {
  const {store} = config;

  if (!config.errorHandler) {
    config.errorHandler = (err) => console.log('VRR error, logging to the console since no handler was provided.', err);
  }

  store.registerModule(MODULE_NAME, requestsStore);

  return {
    ...helpers,

    HTTP: class extends HTTP {
      constructor(resource) {
        super(resource, config);
      }
    },

    registerResource(resources) {
      const uuid = createUUID();
      store.dispatch(`${MODULE_NAME}/registerComponentInStore`, uuid);

      return new Rest(uuid, resources, config);
    },
  };
}
