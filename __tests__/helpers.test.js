import Vue from 'vue';
import envFactory from './Store/envFactory';

// import {registerResource, asyncResourceGetter, asyncResourceValue, updateResourceListWatcher, resourceListGetter} from './HTTP';
import Hints from './Modules/Hints/Resource/resource';
const seenHintsData = require('./DevServer/Endpoints/hints/seenhints.json');
const hintsData = require('./DevServer/Endpoints/hints/hints.json');
const computedPropertyName = 'TEST_COMPUTED_PROPERTY_NAME';

const getJSONObjectById = (obj, idToMatch, key = 'id') => {
  return JSON.stringify(obj.objects.find((item) => item[key] === idToMatch));
};
const getRelatedObjectById = (obj, relatedObj, idToMatch, foreignKey = 'id') => {
  const parent = obj.objects.find(({id}) => id === idToMatch);
  return relatedObj.objects.find(({id}) => id === parent[foreignKey]);
};
const getRelatedObjectsById = (obj, idToMatch, foreignKey = 'id') => {
  return obj.objects.filter((item) => item[foreignKey] === idToMatch);
};
const listJsonObjectById = (obj, ids) => {
  return JSON.stringify(obj.objects.filter(({id}) => ids.includes(id)));
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
      const checkData = getJSONObjectById(seenHintsData, changedIndex);

      const seenHintsResource = registerResource(Hints).SeenHints;

      new Vue({
        store,
        data() {
          return {
            hintId: startIndex,
          };
        },
        computed: {
          ...asyncResourceGetter(computedPropertyName, seenHintsResource, 'this.hintId'),
        },
        watch: {
          [computedPropertyName](val) {
            if (typeof val === 'object' && Object.keys(val).length > 0) {
              if (val.id === startIndex) {
                this.hintId = changedIndex;
              } else {
                expect(JSON.stringify(val)).toEqual(checkData);
                done();
              }
            }
          },
        },
      });
    });

    it('Vue: Set Nested computed property and is Reactive', (done) => {
      const {asyncResourceGetter, registerResource, store} = envFactory();

      const hintsResources = registerResource(Hints);
      const SeenHintsResource = hintsResources.SeenHints;
      const HintsResource = hintsResources.Hints;
      const startIndex = 2;
      const changedIndex = 43;
      const checkData = getRelatedObjectById(seenHintsData, hintsData, startIndex, 'hint');
      const checkChangedData = getRelatedObjectById(seenHintsData, hintsData, changedIndex, 'hint');

      new Vue({
        store,
        data() {
          return {
            seenHintId: startIndex,
          };
        },
        computed: {
          ...asyncResourceGetter(computedPropertyName, [SeenHintsResource, HintsResource], 'this.seenHintId', [
            (data) => data.hint,
            (data) => data,
          ]),
        },
        watch: {
          [computedPropertyName](val) {
            if (typeof val === 'object' && Object.keys(val).length > 0) {
              if (val.id === checkData.id) {
                expect(JSON.stringify(val)).toEqual(JSON.stringify(checkData));
                this.seenHintId = changedIndex;
              }

              if (val.id === checkChangedData.id) {
                expect(JSON.stringify(val)).toEqual(JSON.stringify(checkChangedData));
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
      const HintsResource = registerResource(Hints).Hints;
      const startIndex = [13, 23];
      const changedIndex = [23, 33];
      const checkData = listJsonObjectById(hintsData, changedIndex);

      new Vue({
        store,
        data() {
          return {
            hints: startIndex,
          };
        },
        computed: {
          ...resourceListGetter(computedPropertyName, HintsResource, 'this.hints'),
        },
        watch: {
          [computedPropertyName](val) {
            if (val.length > 0) {
              if (this.hints === startIndex) {
                this.hints = changedIndex;
              } else {
                expect(JSON.stringify(val)).toEqual(checkData);
                done();
              }
            }
          },
        },
      });
    });

    it('Vue: Should handle delayed async values in the pathToInitialValues', (done) => {
      const {resourceListGetter, registerResource, store} = envFactory();
      const HintsResource = registerResource(Hints).Hints;
      const startIndex = [13, 23];
      const checkData = listJsonObjectById(hintsData, startIndex);

      let hasBeenUndefined = false;

      let watcherCalled = 0;

      new Vue({
        store,
        data() {
          return {
            hints: undefined,
          };
        },
        created() {
          expect(this.hints).toEqual(undefined);
          hasBeenUndefined = true;

          setTimeout(() => {
            this.hints = startIndex;
          }, 200);
        },
        computed: {
          ...resourceListGetter(computedPropertyName, HintsResource, 'this.hints'),
        },
        watch: {
          [computedPropertyName]: {
            imediate: true,
            handler(val) {
              watcherCalled++;
              if (val.length !== 0) {
                expect(hasBeenUndefined).toEqual(true);
                expect(JSON.stringify(val)).toEqual(checkData);
                expect(watcherCalled >= 1).toEqual(true);
                done();
              }
            },
          },
        },
      });
    });

    it('Vue: Should get all seen hints by the User', (done) => {
      const {resourceListGetter, registerResource, store} = envFactory();
      const SeenHintsResource = registerResource(Hints).SeenHints;
      const userId = 1376;
      const checkData = getRelatedObjectsById(seenHintsData, userId, 'user');

      new Vue({
        store,
        computed: {
          ...resourceListGetter(computedPropertyName, SeenHintsResource, 'this.queryObject'),
          queryObject() {
            return {
              user: userId,
            }
          },
        },
        watch: {
          [computedPropertyName]: {
            handler(val) {
              if (val.length >= checkData.length) {
                expect(JSON.stringify(val)).toEqual(JSON.stringify(checkData));
                done();
              }
            },
          },
        },
      });
    });
  });

});
