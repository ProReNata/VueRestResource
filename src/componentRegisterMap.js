import constants from './constants';

const componentRegisterMap = {};
let indexCounter = 0;
const {initialInstanceId} = constants;

/*
The logic of idsAssignedWithoutInstance is only to track if there are no bugs.
We could remove it since it produces no value but we keep it so we can track errors in buggy cases
*/
const idsAssignedWithoutInstance = [];

export default {
  add(instance) {
    if (!instance) {
      // lets return early since the instance is not compulsory
      indexCounter += 1;
      idsAssignedWithoutInstance.push(String(indexCounter));

      return String(indexCounter);
    }

    const instanceId = Object.keys(componentRegisterMap).find((uuid) => {
      return componentRegisterMap[uuid] === instance;
    });

    if (instanceId) {
      // its already there, lets not override it
      return instanceId;
    }

    indexCounter += 1;
    componentRegisterMap[indexCounter] = instance;

    return String(indexCounter);
  },
  delete(instanceId) {
    const idHasNoInstance = idsAssignedWithoutInstance.includes(instanceId);

    if (idHasNoInstance) {
      idsAssignedWithoutInstance.splice(idsAssignedWithoutInstance.indexOf(instanceId), 1);
    }

    componentRegisterMap[instanceId] = null;
    delete componentRegisterMap[instanceId];
  },
  get(instanceId) {
    if (instanceId === initialInstanceId) {
      return undefined;
    }

    return componentRegisterMap[instanceId]; // TODO(perjor): What if the index is in the idsAssignedWithoutInstance array?. Returns undefined
  },
};
