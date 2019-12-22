const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();
const IP = process.env.IP || '127.0.0.1';
const PORT = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(bodyParser.json());


// all routes
app.use('/api', require('./router.js'));

// serve static clinet files
// make sure root will load index.html
app.use('/', express.static(path.join(__dirname, '../dist/index.html'), { maxAge: '1d' }));
app.use('/', express.static(path.join(__dirname, '../dist'), { maxAge: '1d' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send({ error: err.message });
});

app.listen(PORT, IP, () => console.log(`Example app running on port ${PORT}`));

module.exports = app;
