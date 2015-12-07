'use strict';

// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var Promise = require('bluebird');

// Models
var db = require('./models');
var fixtures = require('sequelize-fixtures');

// Express app instance
var express = express();
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: false }));
express.use('/v1', require('./routes/v1/index'));
express.use('/v1/members', require('./routes/v1/members'));
express.use('/v1/locations', require('./routes/v1/locations'));
express.use('/v1/reasons', require('./routes/v1/reasons'));
express.use('/v1/records', require('./routes/v1/records'));

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
function seedData(env) {
  if (env === 'development') {
    var promises = [];
    promises.push(fixtures.loadFile('fixtures/reasons.json', db.models));
    promises.push(fixtures.loadFile('fixtures/members.json', db.models));
    promises.push(fixtures.loadFile('fixtures/locations.json', db.models));
    return Promise.all(promises);
  }
  else {
    return Promise.resolve({});
  }
}

// Handle startup errors
function startupError(error) {
  console.error(error);
}

// Start the server
function init(options) {
  express.set('port', options.port);
  express.set('env', options.env);
  return db.sequelize.sync({
    force: (options.env === 'development') ? true : false
  }).then(function() {
    seedData(options.env).then(function() {
      startServer();
    }).catch(startupError); 
  }).catch(startupError);
}

// Public app interface
module.exports = {
  init: init
};
