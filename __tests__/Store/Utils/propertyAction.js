import upperFirst from 'lodash/upperFirst';

export default function propertyAction(action, property) {
  return `${action}${upperFirst(property)}`;
}
