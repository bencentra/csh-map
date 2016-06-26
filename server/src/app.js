'use strict';

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Promise = require('bluebird');
var fixtures = require('sequelize-fixtures');
var path = require('path');

function MapAPI(options) {
  this.server = null;
  this.app = null;
  this.options = options;
  this.db = require('./models');
  this._setupExpressInstance();
  this._configureRoutes();
  this._configureErrorHandlers();
}

MapAPI.prototype.start = function () {
  var options = {
    force: (this.options.env === 'development')
  };
  return this.db.sequelize.sync(options)
    .then(this._seedData.bind(this))
    .then(this._startServer.bind(this));
};

MapAPI.prototype._setupExpressInstance = function () {
  this.app = express();
  this.app.use(cors(this._corsOptionsDelegate.bind(this)));
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(this._createRefererMiddleware());
  this.app.set('port', this.options.port);
  this.app.set('env', this.options.env);
};

MapAPI.prototype._configureRoutes = function () {
  this.app.use('/v1', require('./routes/v1/index'));
  this.app.use('/v1/members', require('./routes/v1/members'));
  this.app.use('/v1/locations', require('./routes/v1/locations'));
  this.app.use('/v1/reasons', require('./routes/v1/reasons'));
  this.app.use('/v1/records', require('./routes/v1/records'));
};

MapAPI.prototype._configureErrorHandlers = function () {
  // 404 error handler middleware
  this.app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // Default error handler
  this.app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: (this.app.get('env') === 'development') ? err : {}
    });
    next();
  }.bind(this));
};

MapAPI.prototype._startServer = function () {
  this.server = this.app.listen(this.app.get('port'), function () {
    var host = this.server.address().address;
    var port = this.server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  }.bind(this));
};

MapAPI.prototype._seedData = function () {
  var that = this;
  var files = ['./fixtures/reasons.json'];
  if (this.app.get('env') === 'development') {
    files.push('./fixtures/members.json');
    files.push('./fixtures/locations.json');
    files.push('./fixtures/records.json');
  }
  return Promise.mapSeries(files, function (file) {
    var pathToFile = path.join(__dirname, file);
    return fixtures.loadFile(pathToFile, that.db.models);
  }).then(function () {
    console.log('Done loading fixtures!');
  });
};

MapAPI.prototype._corsOptionsDelegate = function (req, callback) {
  var corsOptions = {};
  var secret = this.options.secret;
  var origin = this.options.origin;
  if (secret && secret === req.get('Secret')) {
    corsOptions.origin = false;
  } else {
    corsOptions.origin = origin;
  }
  console.log(corsOptions.origin);
  callback(null, corsOptions);
};

MapAPI.prototype._createRefererMiddleware = function () {
  var secret = this.options.secret;
  var referer = this.options.referer;
  return function (req, res, next) {
    var err;
    if (secret && secret === req.get('Secret')) {
      next();
    } else if (referer && referer !== req.get('Referer')) {
      err = new Error('Invalid Referer');
      next(err);
    } else {
      next();
    }
  };
};

module.exports = MapAPI;
