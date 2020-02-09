import envFactory from './Store/envFactory';
import Hints from './Modules/Hints/Resource/resource';
import Vue from 'vue';

describe('Subscriber', () => {
  it('Should return the correct ID of the get object', (done) => {
    const {registerResource, store, activeRequests} = envFactory();
    const hintsResource = registerResource(Hints).Hints;
    const componentMock = new Vue({
      store,
      computed: {
        ...activeRequests('activeRequestsFromComponent'),
      },
    });

    let requestUUID;

    hintsResource.list(componentMock).then((id) => {
      expect(id).toBe(requestUUID);
      done();
    });

    const instanceRequests = componentMock.activeRequestsFromComponent;
    expect(instanceRequests.length).toBe(1);

    requestUUID = instanceRequests[0].id;
  });
});
