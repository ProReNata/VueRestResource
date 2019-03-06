const fs = require('fs');
const path = require('path');
const endpointsPath = 'Endpoints';

const readFile = (filePath, cb) => {
  fs.readFile(filePath, 'utf8', (err, json) => {
    if (err) {
      console.log(err);
      cb(err);
    }

    const data = JSON.parse(json);
    cb(null, data);
  });
};

const mergeById = (originalArray, newData) => {
  const shallowCopy = [...originalArray];
  const index = shallowCopy.findIndex(({id}) => id === newData.id);

  if (index === -1) {
    shallowCopy.push(newData);
  } else {
    shallowCopy[index] = newData;
  }

  return shallowCopy;
};

module.exports = {
  dataFetcher: (req, res) => {
    console.log('url', req.originalUrl);
    const [module, model, id] = req.originalUrl.split('/').filter(Boolean);
    const filePath = path.join(__dirname, endpointsPath, module, `${model}.json`);

    const hasQueryFilter = Object.keys(req.query).filter(key => key !== '_').length > 0;
    const hasID = id && id[0] !== '?';

    readFile(filePath, (err, data) => {
      let response;
      if (id && hasQueryFilter) {
        response = {
          ...data,
          objects: data.objects.filter((obj) =>
            Object.keys(req.query).every((key) => {
              const values = String(req.query[key]).split(',');
              return values.includes(String(obj[key]))
            }),
          ),
        };
      } else if (hasID) {
        response = data.objects.find((obj) => String(obj.id) === String(id));
      } else {
        response = data;
      }
      console.log('Fetching Data', err ? {} : response);

      res.send(err ? {} : response);
    });
  },

  dataSetter: (req, res) => {
    const [module, model, uid] = req.originalUrl.split('/').filter(Boolean);
    const filePath = path.join(__dirname, endpointsPath, module, `${model}.json`);

    console.log('saving new data', module, model, uid, req.body);

    readFile(filePath, (err, serverData) => {
      if (err) {
        console.log(err);
        res.send({});

        return;
      }

      const lastId = serverData.objects.reduce((max, {id}) => Math.max(max, id), 1);
      const payload = req.body;

      if (!uid) {
        payload.id = lastId + 1;
      }

      const objects = mergeById(serverData.objects, payload);
      const newData = {
        ...serverData,
        objects,
      };

      fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (error) => {
        if (error) {
          console.log(error);
          res.send({});
        } else {
          res.send(req.body);
        }
      });
    });
  },
};
