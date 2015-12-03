'use strict';

// Dependencies
require('dotenv').load();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Models
var db = require('./models');

// Routes
var index = require('./routes/index');
var members = require('./routes/members');
var locations = require('./routes/locations');
var reasons = require('./routes/reasons');
var records = require('./routes/records');

// Express app instance
var express = express();
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: false }));
express.use('/', index);
express.use('/members', members);
express.use('/locations', locations);
express.use('/reasons', reasons);
express.use('/records', records);

// 404 error handler middleware
express.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
express.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: (express.get('env') === 'development') ? err : {}
  });
});

// Start express server
function startServer() {
  var server = express.listen(express.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  });
}

// Load seed data
function seedData() {
  Object.keys(db.models).forEach(function(modelName) {
    if ('seedData' in db.models[modelName]) {
      return db.models[modelName].seedData().then(function(result) {
        console.log(modelName + ' seed data loaded successfully!');
      }).catch(function(error) {
        console.log('Error loading seed data for model ' + modelName);
      });
    }
  });
}

// Start the server
function init(options) {
  express.set('port', options.port);
  return db.sequelize.sync({
    // force: true
  }).then(function() {
    seedData();
    startServer();
  }).catch(function(error) {
    console.error(error);
  });
}

// Public app interface
module.exports = {
  init: init
};
