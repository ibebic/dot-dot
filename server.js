'use strict';

// Load environment vars.
require('dotenv').load();
const port = process.env.PORT || 8080;

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const pathJoin = require('path').join;
const api = require('./app/api.js');

// Setup express server.
const app = express()
  .use(morgan('combined'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(pathJoin(__dirname, '/src')))
  .use('/api', api);

// Connect to mongo database.
mongoose.connect(
  process.env.DB_HOST,
  process.env.DB_NAME,
  process.env.DB_PORT, {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD
  });
mongoose.connection.on('error', err =>
  console.error('Error: Connecting to mongo failed,', err.message));

// Start server.
app.listen(port, err => {
  if (err) console.error('Error: Starting server failed,', err.message);
  console.log('App active on port ' + port);
});
