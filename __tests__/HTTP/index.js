import store from '../Store/store';
import vrr from '../../src'; // dev-path

const RestConfig = {
  baseUrl: 'http://localhost:8984', // Development URL
  defaultParams: {},
  httpHeaders: {},
  store,
};

export const {asyncResourceValue, asyncResourceGetter, HTTP, registerResource, resourceListGetter} = vrr(RestConfig);
