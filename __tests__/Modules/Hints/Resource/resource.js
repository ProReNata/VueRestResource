const MODULE = 'Hints';

export default {
  __name: MODULE,
  Hints: {
    apiModel: 'hints',
    apiModule: MODULE,
    httpMethod: 'post',
    handler: function remoteAction(callerInstance, id, data, resources) {
      const {baseUrl, apiModel, apiModule} = callerInstance;
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
