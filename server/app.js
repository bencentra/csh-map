'use strict';

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Promise = require('bluebird');
var fixtures = require('sequelize-fixtures');

function MapAPI(options) {
  this.server = null;
  this.app = null;
  this.port = options.port;
  this.env = options.env;
  this.db = require('./models');
  this._setupExpressInstance();
  this._configureRoutes();
  this._configureErrorHandlers();
}

MapAPI.prototype.init = function() {
  this.app.set('port', this.port);
  this.app.set('env', this.env);
  var that = this;
  return this.db.sequelize.sync({
    force: (this.env === 'development') ? true : false
  }).then(function() {
    return that._seedData();
  }).then(function() {
    that._startServer();
  }).catch(this._startupError);
};

MapAPI.prototype._setupExpressInstance = function() {
  this.app = express();
  this.app.use(cors());
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: false }));
};

MapAPI.prototype._configureRoutes = function() {
  this.app.use('/v1', require('./routes/v1/index'));
  this.app.use('/v1/members', require('./routes/v1/members'));
  this.app.use('/v1/locations', require('./routes/v1/locations'));
  this.app.use('/v1/reasons', require('./routes/v1/reasons'));
  this.app.use('/v1/records', require('./routes/v1/records'));
};

MapAPI.prototype._configureErrorHandlers = function() {
  // 404 error handler middleware
  this.app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // Default error handler
  this.app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: (this.app.get('env') === 'development') ? err : {}
    });
    next();
  }.bind(this));
};

MapAPI.prototype._startServer = function() {
  this.server = this.app.listen(this.app.get('port'), function() {
    var host = this.server.address().address;
    var port = this.server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  }.bind(this));
};

MapAPI.prototype._seedData = function() {
  if (this.env === 'development') {
    var promises = [];
    promises.push(fixtures.loadFile('fixtures/reasons.json', this.db.models));
    promises.push(fixtures.loadFile('fixtures/members.json', this.db.models));
    promises.push(fixtures.loadFile('fixtures/locations.json', this.db.models));
    return Promise.all(promises);
  }
  else {
    return Promise.resolve({});
  }
};

MapAPI.prototype._startupError = function(error) {
  console.error(error);
};

module.exports = MapAPI;
