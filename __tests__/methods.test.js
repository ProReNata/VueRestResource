import envFactory from './Store/envFactory';
import Hints from './Modules/Hints/Resource/resource';
const SERVER_DATA = Object.freeze(require('./DevServer/Endpoints/hints/hints.json'));
const createHintsWithId = 34;

describe('Methods', () => {
  it('All methods are present', () => {
    const Methods = require('../src/Rest').default;
    const instance = new Methods({}, {});
    const methods = ['get', 'list', 'create', 'update', 'delete', 'remoteAction'].filter(
      (meth) => typeof instance[meth] === 'function',
    );
    expect(methods.length).toBe(6);
  });

  describe('API.get', () => {
    it('Should make a get request and update the store', (done) => {
      const {registerResource, store} = envFactory();
      const seenHintsResource = registerResource(Hints).Hints;
      const initialHints = store.getters['Hints/hints'];
      const FETCHED_ID = 23;

      expect(initialHints.length).toBe(0);
      seenHintsResource.get(null, FETCHED_ID).then(() => {
        const fetchedHints = store.getters['Hints/hints'];
        expect(fetchedHints.length).toBe(1);

        const [fetchedObject] = fetchedHints;
        expect(JSON.stringify(fetchedObject)).toBe(JSON.stringify(SERVER_DATA.objects[1]));
        done();
      });
    });
  });

  describe('API.list', () => {
    it('Should make a list request and update the store', (done) => {
      const {registerResource, store} = envFactory();
      const seenHintsResource = registerResource(Hints).Hints;
      const initialHints = store.getters['Hints/hints'];

      expect(initialHints.length).toBe(0);

      seenHintsResource.list(null).then(() => {
        const fetchedHints = store.getters['Hints/hints'];
        expect(fetchedHints.length).toBe(3);
        expect(JSON.stringify(fetchedHints)).toBe(JSON.stringify(SERVER_DATA.objects));
        done();
      });
    });
  });

  describe('API.create', () => {
    it('Should create a new object in the server and store', (done) => {
      const {registerResource, store} = envFactory();
      const seenHintsResource = registerResource(Hints).Hints;
      const initialHints = store.getters['Hints/hints'];

      expect(initialHints.length).toBe(0);

      const NAME = 'newly created hint!';

      seenHintsResource.create(null, {name: NAME}).then(() => {
        const fetchedHints = store.getters['Hints/hints'];
        expect(fetchedHints.length).toBe(1);

        const [newHint] = fetchedHints;
        expect(newHint.name).toBe(NAME);
        expect(newHint.id).toBe(createHintsWithId);
        done();
      });
    });
  });

  describe('API.update', () => {
    it('Should update the server with new data and update the store', (done) => {
      const {registerResource, store} = envFactory();
      const seenHintsResource = registerResource(Hints).Hints;
      const initialHints = store.getters['Hints/hints'];

      expect(initialHints.length).toBe(0);

      const NAME = 'updated Hint!';
      const ID_CREATED_IN_PREVIOUS_TEST = createHintsWithId;

      seenHintsResource.update(null, ID_CREATED_IN_PREVIOUS_TEST, {id: ID_CREATED_IN_PREVIOUS_TEST, name: NAME}).then(() => {
        const fetchedHints = store.getters['Hints/hints'];
        expect(fetchedHints.length).toBe(1);

        const [updatedHint] = fetchedHints;
        expect(updatedHint.name).toBe(NAME);
        expect(updatedHint.id).toBe(ID_CREATED_IN_PREVIOUS_TEST);
        done();
      });
    });
  });

  describe('API.delete', () => {
    it('Should delete a object from the server', (done) => {
      const {registerResource, store} = envFactory();
      const seenHintsResource = registerResource(Hints).Hints;

      const ID_CREATED_IN_PREVIOUS_TEST = createHintsWithId;

      const initialHints = store.getters['Hints/hints'];
      expect(initialHints.length).toBe(0);

      seenHintsResource.list(null).then(() => {
        const fetchedHints = store.getters['Hints/hints'];
        expect(fetchedHints.length).toBe(4);

        seenHintsResource
          .delete(null, ID_CREATED_IN_PREVIOUS_TEST)
          .then(() => {
            const fetchedHints = store.getters['Hints/hints'];
            expect(fetchedHints.length).toBe(3);

            // lets double check the server also deleted the data!
            return seenHintsResource.list(null);
          })
          .then(() => {
            const fetchedHints = store.getters['Hints/hints'];
            expect(fetchedHints.length).toBe(3);

            expect(JSON.stringify(fetchedHints)).toBe(JSON.stringify(SERVER_DATA.objects));
            done();
          });
      });
    });
  });

  describe('API.remoteAction', () => {
    it('Should dispatch data with a chosen http method to the server', (done) => {
      const {registerResource, store} = envFactory();
      const hintsResource = registerResource(Hints).Acknowledged;
      const storePath = 'Hints/hints';

      const ID_OF_HINT = 33;

      const initialHints = store.getters[storePath];
      expect(initialHints.length).toBe(0);

      hintsResource.remoteAction(null, ID_OF_HINT).then(() => {
        const fetchedHints = store.getters[storePath];
        const [updatedHint] = fetchedHints;

        expect(fetchedHints.length).toBe(1);
        expect(updatedHint.acknowledged).toBe(true);
        expect(updatedHint.id).toBe(ID_OF_HINT);

        hintsResource.remoteAction(null, ID_OF_HINT).then(() => {
          const fetchedHints = store.getters[storePath];
          const [updatedHint] = fetchedHints;

          expect(fetchedHints.length).toBe(1);
          expect(updatedHint.acknowledged).toBe(false);
          expect(updatedHint.id).toBe(ID_OF_HINT);

          done();
        });
      });
    });
  });

  /*
  describe('API store request tracking', () => {

    xit('', (done) => {

    });

  });
  */
});
