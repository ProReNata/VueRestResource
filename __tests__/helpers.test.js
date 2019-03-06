const Vue = require('../node_modules/vue/dist/vue.common.dev');
const helpers = require('../src/helpers').default;
const {asyncResourceGetter, asyncResourceValue, updateResourceListWatcher, resourceListGetter} = helpers;

const watcherName = 'testWatcher';
const computedPropertyName = 'someComputedPropertyName'
const resourceKey = 'someKey';
const resourceName = 'someName';
const listOptionsKey = 'querySetringKey';
const testKeyValue = 12345;

describe('Helpers', () => {
  it('All helpers are present', () => {
    expect(Object.keys(helpers).length).toBe(4);
  });

  describe('asyncResourceGetter', () => {

    it('should return the wished computed property key name', () => {
      const helper = asyncResourceGetter(computedPropertyName);
      expect(helper.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

    it('should return the wished computed property key name', () => {
      const instance = new Vue({
        computed: {
          asyncResourceGetter(computedPropertyName, )
        }
      });
      console.log(instance.test);
      // expect(helper.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

  });

});
