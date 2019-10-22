const MODULE = 'Hints';

export default {
  __name: MODULE,
  Hints: {
    apiModel: 'hints',
    apiModule: MODULE,
    httpMethod: 'post',
    remoteAction(callerInstance, id, data, resources, {baseUrl, apiModel, apiModule}) {
      return {
        ...resources,
        endpoint: [baseUrl, apiModule, apiModel, id, 'acknowledged/'].join('/').toLowerCase(),
      };
    },
  },
  SeenHints: {
    apiModel: 'seenhints',
    apiModule: MODULE,
    handler: {},
  },
};
