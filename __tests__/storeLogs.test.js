import Vue from 'vue';
import envFactory from './Store/envFactory';
import Hints from './Modules/Hints/Resource/resource';

describe('Methods', () => {
  it('Initial getters config should be correct', () => {
    const {store} = envFactory();
    const getters = Object.keys(store.getters);

    const gexpectedGetters = [
      'VRR_Tests/activeRequestsToEndpoint',
      'VRR_Tests/lastUpdatedComponent',
      'VRR_Tests/registeredComponents',
    ];

    for (let key of getters) {
      expect(gexpectedGetters.includes(key)).toBe(true);
    }

    expect(Object.keys(getters).length).toBe(3);
  });

  describe('Instance logging', () => {
    it('Should add a entrance to the Instance when a request is fired', (done) => {
      const {store, registerResource} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        created() {
          const registeredComponents = store.getters['VRR_Tests/registeredComponents'];
          expect(registeredComponents.size).toBe(0);

          HintsResource.list(this);

          setTimeout(() => {
            const instanceRequests = registeredComponents.get(this);
            expect(Array.isArray(instanceRequests)).toBe(true);
            expect(instanceRequests.length).toBe(1);
            done();
          }, 50);
        },
      });
    });

    it('Should remove the reference to the component instance when the component is destroyed', (done) => {
      const {store, registerResource} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        created() {
          const registeredComponents = store.getters['VRR_Tests/registeredComponents'];
          expect(registeredComponents.size).toBe(0);

          HintsResource.list(this);
          this.$destroy();

          setTimeout(() => {
            const instanceRequests = registeredComponents.get(this);
            expect(typeof instanceRequests).toBe('undefined');
            done();
          }, 100);
        },
      });
    });

    it('Should add keep track of a instances open requests', (done) => {
      const {store, registerResource} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        created() {
          const registeredEndpointsBefore = store.getters['VRR_Tests/activeRequestsToEndpoint'];

          expect(Object.keys(registeredEndpointsBefore).length).toBe(0);

          HintsResource.list(this);

          setTimeout(() => {
            const registeredEndpointsAfter = store.getters['VRR_Tests/activeRequestsToEndpoint'];
            expect(registeredEndpointsAfter.hasOwnProperty(HintsResource.endpoint)).toBe(true);
            done();
          }, 50);
        },
      });
    });

  });
  describe('Updating and cleaning up', () => {

    it('Should update and remove requests as expected', (done) => {
      const {store, registerResource} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        created() {
          let testMoments = 0;
          const registeredEndpointsBefore = store.getters['VRR_Tests/activeRequestsToEndpoint'];
          expect(Object.keys(registeredEndpointsBefore).length).toBe(0);
          testMoments++;
          HintsResource.list(this).then(() => {
            // check the endpoint list
            const [secondEndpointRequestStatus] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
            expect(secondEndpointRequestStatus.status).toBe('success');

            // check the instance list
            const [secondInstanceRequestStatus] = store.getters['VRR_Tests/registeredComponents'].get(this);
            expect(secondInstanceRequestStatus.status).toBe('success');

            testMoments++;
          });

          // check the endpoint list
          const [firstEndpointRequestStatus] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
          expect(firstEndpointRequestStatus.status).toBe('pending');

          // check the instance list
          const [firstInstanceRequestStatus] = store.getters['VRR_Tests/registeredComponents'].get(this);
          expect(firstInstanceRequestStatus.status).toBe('pending');

          setTimeout(() => {
            const [secondEndpointRequestStatus] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
            expect(typeof secondEndpointRequestStatus).toBe('undefined');

            const [secondInstanceRequestStatus] = store.getters['VRR_Tests/registeredComponents'].get(this);
            expect(typeof secondInstanceRequestStatus).toBe('undefined');

            testMoments++;
            expect(testMoments).toBe(3);

            done();
          }, 250);
        },
      });
    });

    it('A request should be cancelable', (done) => {
      const {store, registerResource} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        created() {
          const expectedStatus = 'canceled';
          let lastUpdatedStatus = '';
          const registeredEndpointsBefore = store.getters['VRR_Tests/activeRequestsToEndpoint'];

          expect(Object.keys(registeredEndpointsBefore).length).toBe(0);

          HintsResource.list(this)
            .then(() => {
              // this should not run!
              lastUpdatedStatus = 'success';
            })
            .catch(() => {
              const [request] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
              lastUpdatedStatus = request.status;
            });

          const [request] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
          expect(request.status).toBe('pending');
          request.cancel();

          setTimeout(() => {
            expect(lastUpdatedStatus).toBe(expectedStatus);
            expect(store.getters['Hints/hints'].length === 0).toBe(true);

            done();
          }, 250);
        },
      });
    });
  });

  /*
  describe('Endpoint logging', () => {
    it('', (done) => {});
  });

  describe('Logging settings', () => {
    it('', (done) => {});
  });


*/
});
