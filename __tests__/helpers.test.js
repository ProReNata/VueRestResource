const helpers = require('../src/helpers').default;

test('All helpers are present', () => {
  expect(Object.keys(helpers).length).toBe(3);
});

test('Resource list to be called', (done) => {
  const watcherName = 'testWatcher';
  const resourceKey = 'someKey';
  const resourceName = 'someName';
  const listOptionsKey = 'querySetringKey';
  const testKeyValue = 12345;

  const listCallback = function(opts) {
    expect(opts[listOptionsKey]).toBe(testKeyValue);
    done();
  };

  const resource = {
    list(opts) {
      listCallback(opts);
    },
  };

  const instance = {
    [resourceName]: resource,
  };

  const watcher = helpers.updateResourceListWatcher(watcherName, true, resourceName, listOptionsKey, resourceKey)[watcherName];
  expect(watcher.immediate).toBe(true);
  watcher.handler.call(instance, {[resourceKey]: testKeyValue}, {[resourceKey]: testKeyValue});
});
