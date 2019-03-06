export default function filterDuplicatesByProperty(key) {
  return function boundFilterDuplicatesByProperty(el, i, arr) {
    const value = el[key];
    const firstEntry = arr.find((element) => element[key] === value);

    return arr.indexOf(firstEntry) === i;
  };
}
