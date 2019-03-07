import storeGenerator from 'Global/Store/Utils/storeGenerator';

export default function storeSectionsGenerators(resourceNames, actions) {
  const resourceNamesIteratee = function _resourceNamesIteratee(obj, resourceName, i) {
    const args = resourceName;

    if (actions && actions[i]) {
      args.push(actions[i]);
    }

    const newResource = storeGenerator.actions.apply(null, args);

    return {
      ...obj,
      ...newResource,
    };
  };

  return resourceNames.reduce(resourceNamesIteratee, {});
}
