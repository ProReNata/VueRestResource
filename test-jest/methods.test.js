import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import envFactory from '../__tests__/Store/envFactory';
import Hints from '../__tests__/Modules/Hints/Resource/resource';

const mock = new MockAdapter(axios);
const VrrConfig = {
  errorHandler: (error) => {
    throw error;
  },
};

describe('axios Error', () => {
  it('should return 403 status error when it fails due to authentication', async () => {
    expect.assertions(1);
    mock.onGet().reply(403);

    const {registerResource} = envFactory(VrrConfig);
    const seenHintsResource = registerResource(Hints).Hints;

    try {
      await seenHintsResource.get(null, 1);
    } catch (error) {
      expect(error.internalError.response.status).toBe(403);
    }
  });

  it('should return network status error when it fails without mocking', async () => {
    expect.assertions(2);
    mock.restore();

    const {registerResource} = envFactory(VrrConfig);
    const seenHintsResource = registerResource(Hints).Hints;

    try {
      await seenHintsResource.get(null, 1);
    } catch (error) {
      expect(error.internalError.response).toBeUndefined();
      expect(error.internalError.message).toBe('Network Error');
    }
  });
});
