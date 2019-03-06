import Vue from 'vue';
import envFactory from './Store/envFactory';

// import {registerResource, asyncResourceGetter, asyncResourceValue, updateResourceListWatcher, resourceListGetter} from './HTTP';
import Hints from './Modules/Hints/Resource/resource';
const seenHintsData = require("./DevServer/Endpoints/hints/seenhints.json");
const hintsData = require("./DevServer/Endpoints/hints/hints.json");
const watcherName = 'testWatcher';
const computedPropertyName = 'TEST_COMPUTED_PROPERTY_NAME';
const resourceKey = 'someKey';
const resourceName = 'someName';
const listOptionsKey = 'querySetringKey';
const testKeyValue = 12345;

const getJsonObjectById = (obj, idToMatch) => {
  return JSON.stringify(obj.objects.find(({id}) => id === idToMatch))
};
const listJsonObjectById = (obj, ids) => {
  return JSON.stringify(obj.objects.filter(({id}) => ids.includes(id)))
};

describe('Helpers', () => {
  it('All helpers are present', () => {
    const helpers = require('../src/helpers').default;
    expect(Object.keys(helpers).length).toBe(4);
  });

  describe('asyncResourceGetter', () => {
    it('Matches computed property key name', () => {
      const {asyncResourceGetter} = envFactory();
      const helper = asyncResourceGetter(computedPropertyName);
      expect(helper.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

    it('Vue: Set computed property and is Reactive', (done) => {
      const {asyncResourceGetter, registerResource, store} = envFactory();

      const startIndex = 1;
      const changedIndex = 2;
      const checkData = getJsonObjectById(seenHintsData, changedIndex);

      const seenHintsResource = registerResource(Hints.SeenHints);

      new Vue({
        store,
        data() {
          return {
            hintId: startIndex,
          }
        },
        computed: {
          ...asyncResourceGetter(computedPropertyName, seenHintsResource, 'this.hintId'),
        },
        watch: {
          [computedPropertyName](val) {
            if(typeof val === 'object' && Object.keys(val).length > 0) {
              if (this[computedPropertyName].id === startIndex) {
                this.hintId = changedIndex;
              } else {
                expect(JSON.stringify(this[computedPropertyName])).toEqual(checkData);
                done();
              }
            }
          },
        },
      })
    });

    it('Searches inside custom function', (done) => {
      const {asyncResourceGetter, registerResource, store} = envFactory();

      const SeenHintsResource = registerResource(Hints.SeenHints);
      const startIndex = 1;
      const changedIndex = 2;
      const checkData = getJsonObjectById(seenHintsData, changedIndex);
      console.log(store._modulesNamespaceMap['']._children.Hints.state.seenhints);

      new Vue({
        store,
        data() {
          return {
            hintId: startIndex,
          }
        },
        computed: {
          ...asyncResourceGetter(computedPropertyName, SeenHintsResource, 'this.hintId'),
        },
        watch: {
          [computedPropertyName](val) {
            if(typeof val === 'object' && Object.keys(val).length > 0) {
              if (this[computedPropertyName].id === startIndex) {
                this.hintId = changedIndex;
              } else {
                expect(JSON.stringify(this[computedPropertyName])).toEqual(checkData);
                done();
              }
            }
          },
        },
      });
    });

  });

  describe('resourceListGetter', () => {
    it('Matches computed property key name', () => {
      const {resourceListGetter} = envFactory();

      const helper = resourceListGetter(computedPropertyName);
      expect(helper.hasOwnProperty(computedPropertyName)).toBeTruthy();
    });

    it('Vue: Set computed property and is Reactive', (done) => {
      const {resourceListGetter, registerResource, store} = envFactory();
      const HintsResource = registerResource(Hints.Hints);
      const startIndex = [1, 2];
      const changedIndex = [2, 3];
      const checkData = listJsonObjectById(hintsData, changedIndex);

      new Vue({
        store,
        data() {
          return {
            hints: startIndex,
          }
        },
        computed: {
          ...resourceListGetter(computedPropertyName, HintsResource, 'this.hints'),
        },
        watch: {
          [computedPropertyName](val) {
            if(val.length > 0) {
              if (this.hints === startIndex) {
                this.hints = changedIndex;
              } else {
                expect(JSON.stringify(this[computedPropertyName])).toEqual(checkData);
                done();
              }
            }
          }
        },
      });
    });

  });

});
