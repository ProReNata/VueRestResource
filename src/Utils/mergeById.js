export default function mergeById(originalArray, newData) {
  const shallowCopy = [...originalArray];
  const index = shallowCopy.findIndex((data) => data.id === newData.id);

  if (index === -1) {
    shallowCopy.push(newData);
  } else {
    shallowCopy[index] = newData;
  }

  return shallowCopy;
}
