import envFactory from './Store/envFactory';
import Hints from './Modules/Hints/Resource/resource';

describe('Subscriber', () => {
  it('Should return the correct ID of the get object', (done) => {
    const {registerResource, store} = envFactory();
    const hintsResource = registerResource(Hints).Hints;
    const componentMock = {};
    let requestUUID;

    hintsResource.list(componentMock).then((id) => {
      expect(id).toBe(requestUUID);
      done();
    });

    const activeRequests = store.getters['VRR_Tests/registeredComponents'].get(componentMock);
    expect(activeRequests.length).toBe(1);

    requestUUID = activeRequests[0].id;
  });
});
