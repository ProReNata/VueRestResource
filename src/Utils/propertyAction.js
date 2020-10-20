import upperFirst from 'lodash/upperFirst';

/**
 * Returns a concatenated string for the action name. E.g. 'listPatient'.
 *
 * @param {string} action - List, get, create, ...
 * @param {string} property - The module name.
 * @returns {string} A concatenated string for the action name. E.g. 'listPatient'.
 */
export default function propertyAction(action, property) {
  return `${action}${upperFirst(property)}`;
}
