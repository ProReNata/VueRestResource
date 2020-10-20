import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import envFactory from '../__tests__/Store/envFactory';
import Hints from '../__tests__/Modules/Hints/Resource/resource';

const mock = new MockAdapter(axios);
mock.onGet().reply(403);

describe('Methods: Update', () => {
  it('Should return the network error when it fails', async () => {
    const {registerResource, store} = envFactory({
      errorHandler: (error) => {
        Promise.reject(error);
      },
    });
    const seenHintsResource = registerResource(Hints).Hints;
    const initialHints = store.getters['Hints/hints'];

    expect(initialHints.length).toBe(0);

    const id = 1;

    try {
      await seenHintsResource.get(null, id);
    } catch (error) {
      console.info(error);
      console.info(error.internalError);
      expect(error.internalError.response.status).toBe('403');
    }
  });
});
