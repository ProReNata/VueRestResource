import createUUID from 'uuid/v4';
import HTTP from './methods';
import Rest from './http';
import helpers from './helpers';
import requestsStore from './requestsStore';
import MODULE_NAME from './moduleName';

export default function createVueRestResource(config) {
  const {store} = config;
  store.registerModule(MODULE_NAME, requestsStore); // https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration

  return {
    ...helpers,

    HTTP: class extends HTTP {
      constructor(resource) {
        super(resource, config);
      }
    },

    registerResource(resource) {
      const uuid = createUUID();
      store.dispatch(`${MODULE_NAME}/registerComponentInStore`, uuid);

      return new Rest(uuid, resource, config);
    },
  };
}
