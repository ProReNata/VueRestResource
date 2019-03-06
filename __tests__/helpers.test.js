import Vue from 'vue';
import store from './Store/store';

import {registerResource, asyncResourceGetter, asyncResourceValue, updateResourceListWatcher, resourceListGetter} from './HTTP';
import Hints from './Modules/Hints/Resource/resource';
const watcherName = 'testWatcher';
const computedPropertyName = 'TEST_COMPUTED_PROPERTY_NAME';
const resourceKey = 'someKey';
const resourceName = 'someName';
const listOptionsKey = 'querySetringKey';
const testKeyValue = 12345;

describe('Helpers', () => {
  it('All helpers are present', () => {
    const helpers = require('../src/helpers').default;
    expect(Object.keys(helpers).length).toBe(4);
  });

  describe('asyncResourceGetter', () => {
    it('Matches computed property key name', () => {
      const helper = asyncResourceGetter(computedPropertyName);
      expect(helper.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

    it('Sets the correct computed property in a Vue instance', () => {
      const SeenHintsResource = registerResource(Hints.SeenHints);
      const instance = new Vue({
        store,
        computed: {
          userId() { return 1 },
          ...asyncResourceGetter(computedPropertyName, SeenHintsResource, 'this.userId'),
        },
      });
      // console.log(instance[computedPropertyName]);
      expect(instance.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

  });

  describe('resourceListGetter', () => {
    it('Matches computed property key name', () => {
      const helper = resourceListGetter(computedPropertyName);
      expect(helper.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

    it('Sets the correct computed property in a Vue instance', (done) => {
      const HintsResource = registerResource(Hints.Hints);
      const instance = new Vue({
        store,
        data() {
          return {
            hints: []
          }
        },
        computed: {
          ...resourceListGetter(computedPropertyName, HintsResource, 'this.hints'),
        },
        created() {
          setTimeout(() => this.hints = [1, 2], 250)
        },
        watch: {
          [computedPropertyName](val) {
            if(val.length > 0) {
              console.log(instance[computedPropertyName]);
              console.log(instance.hints);
              expect(instance.hasOwnProperty(computedPropertyName)).toBeTruthy();
              done();
            }
          }
        },
      });
      // setTimeout(() => {
      //   console.log(instance[computedPropertyName]);
      //   console.log(instance.hints);
      //   expect(instance.hasOwnProperty(computedPropertyName)).toBeTruthy();
      //   done();
      // }, 2000);
    });

  });

});
