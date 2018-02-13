import createUUID from 'uuid/v4';
import HTTP from './src/http';
import Rest from './src/rest';
import requestsStore from './src/requestsStore';
import MODULE_NAME from './src/moduleName';

export default (config) => {
    const {store} = config;
    store.registerModule(MODULE_NAME, requestsStore);

    return {
        registerResource: (resources) => {
            const uuid = createUUID();
            store.dispatch('Requests/registerComponentInStore', uuid);
            return new Rest(uuid, resources, config);
        },
        HTTP: HTTP,
    }
}
