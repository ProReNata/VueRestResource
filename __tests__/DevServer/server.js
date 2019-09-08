const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const {dataDeleter, dataFetcher, dataSetter} = require('./serverActions');

const app = express();
const port = 8984;
const jsonParser = bodyParser.json();

app.use(cors());
app.options('*', cors());

app.get(/favicon\.ico/, (req, res) => res.send(''));

app.get('*', dataFetcher);
app.put('*', jsonParser, dataSetter);
app.post('*', jsonParser, dataSetter);
app.delete('*', jsonParser, dataDeleter);

app.listen(port, () => console.log(`Dev server running on port ${port}!`));
