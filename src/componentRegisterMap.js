const componentRegisterMap = {};
let indexCounter = 0;

export default {
  add(instance) {
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
    if (!componentRegisterMap[instanceId]) {
      throw new Error('component not registered');
    }

    componentRegisterMap[instanceId] = null;
    delete componentRegisterMap[instanceId];
  },
  get(instanceId) {
    if (!componentRegisterMap[instanceId]) {
      throw new Error('component not registered');
    }

    return componentRegisterMap[instanceId];
  },
};
