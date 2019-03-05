const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const {eketorpDataFetcher, eketorpDataSetter} = require('./serverActions');

const app = express();
const port = 8080;
const jsonParser = bodyParser.json();

app.use(cors());
app.options('*', cors());

app.get(/favicon\.ico/, (req, res) => res.send(''));

app.get('*', eketorpDataFetcher);
app.put('*', jsonParser, eketorpDataSetter);
app.post('*', jsonParser, eketorpDataSetter);

app.listen(port, () => console.log(`Dev server running on port ${port}!`));
