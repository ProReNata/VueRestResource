import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import envFactory from '../__tests__/Store/envFactory';
import Hints from '../__tests__/Modules/Hints/Resource/resource';

const mock = new MockAdapter(axios);

describe('Axios Error', () => {
  it('Should return 403 status error when it fails due to authentication', async () => {
    mock.onGet().reply(403);

    const {registerResource} = envFactory({
      errorHandler: (error) => {
        throw new Error(JSON.stringify(error));
      },
    });
    const seenHintsResource = registerResource(Hints).Hints;

    try {
      await seenHintsResource.get(null, 1);
    } catch (err) {
      const error = JSON.parse(err.message);
      expect(error.internalError.response.status).toBe(403);
    }
  });

  it('Should return network status error when it fails without mocking', async () => {
    mock.restore();

    const {registerResource} = envFactory({
      errorHandler: (error) => {
        throw new Error(JSON.stringify(error));
      },
    });
    const seenHintsResource = registerResource(Hints).Hints;

    try {
      await seenHintsResource.get(null, 1);
    } catch (err) {
      const error = JSON.parse(err.message);
      expect(error.internalError.response).toBeUndefined;
      expect(error.internalError.message).toBe('Network Error');
    }
  });
});
