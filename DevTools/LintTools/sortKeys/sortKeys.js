const fs = require('fs');
const nodePath = require('path');

const jscodeshift = require('jscodeshift');
const getFiles = require('../../Utils/getFiles');

const APP_ROOT = nodePath.join(__dirname, '../../../');
const scriptContent = /<script>[\s\S]+<\/script>/;

const ignoredFiles = require('./ignoredFiles');

const transform = (file, api) => {
  const j = api.jscodeshift;

  const naturalSortObject = (obj) => {
    const arr = obj.value.properties;
    arr.sort((a, b) => {
      if (a.type.match(/^Spread/)) return -1;
      if (b.type.match(/^Spread/)) return 1;
      if (!a.key || !b.key) return 0;
      if (!a.key.name || !b.key.name) return 0;
      return a.key.name.localeCompare(b.key.name);
    });
  };

  return j(file.source)
    .find(j.ExportDefaultDeclaration, {declaration: {type: 'ObjectExpression'}})
    .forEach((vueObject) => {
      const vueAPIKeys = vueObject.value.declaration.properties;
      vueAPIKeys.forEach((key) =>
        j(key)
          .find(j.ObjectExpression)
          .forEach(naturalSortObject),
      );
    })
    .toSource();
};

const jsFileExtraSort = (file, api) => {
  const j = api.jscodeshift;

  const naturalSortObject = (obj) => {
    const arr = obj.value.properties;
    arr.sort((a, b) => {
      if (a.type.match(/^Spread/)) return -1;
      if (b.type.match(/^Spread/)) return 1;
      if (!a.key || !b.key) return 0;
      if (!a.key.name || !b.key.name) return 0;
      if (typeof a.key.name === 'number' && typeof b.key.name === 'number') return b.key.name - a.key.name;
      return a.key.name.localeCompare(b.key.name);
    });
  };

  const jsSorted = j(file.source)
    .find(j.ObjectExpression)
    .forEach(naturalSortObject)
    .toSource();

  return j(jsSorted)
    .find(jscodeshift.Identifier, {name: 'Vue'})
    .filter((path) => path.parentPath.value.type === 'NewExpression')
    .map((path) => {
      if (!path.parentPath.value.arguments[0] || !path.parentPath.value.arguments[0].properties) return path;

      path.parentPath.value.arguments[0].properties = path.parentPath.value.arguments[0].properties.sort((a, b) => {
        if (a.type.match(/^Spread/)) return -1;
        if (b.type.match(/^Spread/)) return 1;
        if (!a.key || !b.key) return 0;
        if (!a.key.name || !b.key.name) return 0;
        return 0;
      });

      return path;
    })
    .toSource();
};

function processFile(file) {
  const shouldIgnore = ignoredFiles.find((ignoredPath) => file.includes(ignoredPath));
  if (shouldIgnore) return;

  console.log('Processing:', file);
  const isVueFile = Boolean(file.match(/.vue$/));

  const fileContent = fs.readFileSync(file, 'utf8');
  let source = fileContent;

  if (isVueFile) {
    const match = fileContent.match(scriptContent);
    if (!match) return;
    source = match[0].slice('<script>'.length, -'</script>'.length);
  }

  // console.log('::: SOURCE :::');
  // console.log(source);

  let transformed = transform({source}, {jscodeshift});

  if (!isVueFile) transformed = jsFileExtraSort({source: transformed}, {jscodeshift});

  // console.log('::: JSCODESHIFT :::');
  // console.log(transformed);

  const newContent = isVueFile ? fileContent.replace(scriptContent, `<script>${transformed}</script>`) : transformed;

  fs.writeFileSync(file, newContent);
  // fs.writeFileSync(__dirname + '/test.vue', newContent);
}

['.js'].forEach((type) => {
  getFiles(APP_ROOT, type)
    .then((files) => {
      const sourceFiles = files.filter((filePath) => !filePath.includes('node_modules') && !filePath.includes('sandbox'));
      console.log('Found', sourceFiles.length, 'files of type:', type);
      sourceFiles.forEach(processFile);
      return sourceFiles;
    })
    .catch((err) => console.log(err));
});
