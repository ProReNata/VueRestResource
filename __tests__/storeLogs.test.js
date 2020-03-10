import Vue from 'vue';
import envFactory from './Store/envFactory';
import Hints from './Modules/Hints/Resource/resource';

describe('Methods', () => {
  it('Initial getters config should be correct', () => {
    const {store} = envFactory();
    const getters = Object.keys(store.getters);

    const expectedGetters = [
      'VRR_Tests/activeRequestsToEndpoint',
      'VRR_Tests/lastUpdatedComponent',
      'VRR_Tests/activeRequestsFromComponent',
    ];

    for (let key of getters) {
      expect(expectedGetters.includes(key)).toBe(true);
    }

    expect(Object.keys(getters).length).toBe(3);
  });

  describe('Instance logging', () => {
    it('Should add a entrance to the Instance when a request is fired', (done) => {
      const {store, registerResource, activeRequests} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        computed: {
          ...activeRequests('activeRequestsFromComponent'),
        },
        created() {
          const instanceRequests = this.activeRequestsFromComponent;
          expect(instanceRequests.length).toBe(0);

          HintsResource.list(this);

          setTimeout(() => {
            const instanceRequests = this.activeRequestsFromComponent;
            expect(Array.isArray(instanceRequests)).toBe(true);
            expect(instanceRequests.length).toBe(1);
            done();
          }, 50);
        },
      });
    });

    it('Should remove the reference to the component instance when the component is destroyed', (done) => {
      const {store, registerResource, activeRequests} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        computed: {
          ...activeRequests('activeRequestsFromComponent'),
        },
        created() {
          const instanceRequests = this.activeRequestsFromComponent;
          expect(instanceRequests.length).toBe(0);

          HintsResource.list(this);

          setTimeout(() => {
            const instanceRequests = this.activeRequestsFromComponent;
            expect(instanceRequests.length).toBe(1);
            this.$destroy();
            // we trigger it twice because the library should be able to handle already removed components
            store.dispatch('VRR_Tests/deleteInstance', this);

            setTimeout(() => {
              const instanceRequests = this.activeRequestsFromComponent;
              expect(instanceRequests.length).toBe(0);
              done();
            }, 100);
          }, 50);
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
      const {store, registerResource, activeRequests} = envFactory();
      const HintsResource = registerResource(Hints).Hints;

      new Vue({
        store,
        computed: {
          ...activeRequests('activeRequestsFromComponent'),
        },

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
            const [secondInstanceRequestStatus] = this.activeRequestsFromComponent;
            expect(secondInstanceRequestStatus.status).toBe('success');

            testMoments++;
          });

          // check the endpoint list
          const [firstEndpointRequestStatus] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
          expect(firstEndpointRequestStatus.status).toBe('pending');

          // check the instance list
          const [firstInstanceRequestStatus] = this.activeRequestsFromComponent;
          expect(firstInstanceRequestStatus.status).toBe('pending');

          setTimeout(() => {
            const [secondEndpointRequestStatus] = store.getters['VRR_Tests/activeRequestsToEndpoint'][HintsResource.endpoint];
            expect(typeof secondEndpointRequestStatus).toBe('undefined');

            const [secondInstanceRequestStatus] = this.activeRequestsFromComponent;
            expect(typeof secondInstanceRequestStatus).toBe('undefined');

            testMoments++;
            expect(testMoments).toBe(3);

            done();
          }, 250);
        },
      });
    });

    it('A request should be cancelable', (done) => {
      const {store, registerResource} = envFactory({
        errorHandler: (err) => {
          throw new Error(err);
        },
      });
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

    it('Should allow methods called without instance', (done) => {
      const {store, registerResource} = envFactory({
        errorHandler: (err) => {
          throw new Error(err);
        },
      });
      const HintsResource = registerResource(Hints).Hints;
      let error;
      const lastUpdatedComponent = store.getters['VRR_Tests/lastUpdatedComponent'];
      let _lastUpdatedComponent;

      new Vue({
        store,
        created() {
          HintsResource.list()
            .then(() => {
              _lastUpdatedComponent = store.getters['VRR_Tests/lastUpdatedComponent'];
            })
            .catch((err) => {
              error = err;
            });

          setTimeout(() => {
            expect(typeof error).toBe('undefined');
            expect(_lastUpdatedComponent).toBe(lastUpdatedComponent);
            done();
          }, 250);
        },
      });
    });
  });

  /*
  describe('Endpoint logging', () => {
    it('', (done) => {});
    // TODO: test with disabled logging for endpoints and instances
  });

  describe('Logging settings', () => {
    it('', (done) => {});
  });


*/
});
