'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

// Logging
var logFn = console.log;
if (env !== 'development') {
  // TODO - Implement logging to file
  logFn = function noop() {};
}
config.logging = logFn;

// Initialize sequelize and create db object
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {
  models: {},
  sequelize: sequelize,
  Sequelize: Sequelize
};

// Load models into db object
fs.readdirSync(__dirname)
  .filter(function(file) {
    return file.indexOf('.') !== 0 && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db.models[model.name] = model;
  });

// Perform database associations
Object.keys(db.models).forEach(function(modelName) {
  if ('associate' in db.models[modelName]) {
    db.models[modelName].associate(db.models);
  }
});

module.exports = db;
