import envFactory from './Store/envFactory';
import Hints from './Modules/Hints/Resource/resource';

describe('Queue', () => {
  it('Should send only one request when multiple duplicates are fired', (done) => {
    const {registerResource, store} = envFactory();
    const seenHintsResource = registerResource(Hints).Hints;
    const initialHints = store.getters['Hints/hints'];
    const FETCHED_ID = 23;
    const endpoint = `${seenHintsResource.endpoint}${FETCHED_ID}/`;

    expect(initialHints.length).toBe(0);

    let responses = [];

    seenHintsResource.get(null, FETCHED_ID, {}, (req) => {
      responses.push(req);
    });

    seenHintsResource.get(null, FETCHED_ID, {}, (req) => {
      responses.push(req);
    });

    seenHintsResource.get(null, FETCHED_ID, {}, (req) => {
      responses.push(req);
    });

    const requests = store.getters['VRR_Tests/activeRequestsToEndpoint'][endpoint];
    const hasPendingState = requests.every(({status}) => status === 'pending');
    expect(hasPendingState).toBe(true);

    setTimeout(() => {
      expect(responses.length).toBe(3);
      const [one, two, three] = responses;
      const isSameRequest = one.uuidTestCounter === two.uuidTestCounter && two.uuidTestCounter === three.uuidTestCounter;
      expect(isSameRequest).toBe(true);
      const requests = store.getters['VRR_Tests/activeRequestsToEndpoint'][endpoint];
      expect(requests.length).toBe(0);

      done();
    }, 500);
  });
});
