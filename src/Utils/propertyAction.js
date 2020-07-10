import upperFirst from 'lodash/upperFirst';
/**
 * Returns a concatenated string for the action name. e.g. 'listPatient'
 * @param {string} action - list, get, create, ...
 * @param {string} property - the module name
 * @returns {string} a concatenated string for the action name. e.g. 'listPatient'
 */
export default function propertyAction(action, property) {
  return `${action}${upperFirst(property)}`;
}
