'use strict';

// Dependencies
require('dotenv').load();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Routes
var index = require('./routes/index');

// Express app instance
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', index);

// 404 error handler middleware
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

module.exports = app;
