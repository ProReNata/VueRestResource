import createUUID from 'uuid/v4';
import HTTP from './src/methods';
import Rest from './src/http';
import helpers from './src/helpers';
import requestsStore from './src/requestsStore';
import MODULE_NAME from './src/moduleName';

export default (config) => {
  const {store} = config;
  store.registerModule(MODULE_NAME, requestsStore);

  return {
    ...helpers,

    HTTP: class extends HTTP {
      constructor(resource) {
        super(resource, config);
      }
    },

    registerResource: (resources) => {
      const uuid = createUUID();
      store.dispatch(`${MODULE_NAME}/registerComponentInStore`, uuid);
      return new Rest(uuid, resources, config);
    },
  };
};
