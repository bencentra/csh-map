'use strict';

var models = require('../models').models;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  models.Record.findAll({
    include: [
      { model: models.Member },
      { model: models.Location },
      { model: models.Reason }
    ]
  }).then(function(records) {
    res.send(records);
  }).catch(function(error) {
    res.send(error);
  });
});

router.post('/', function(req, res) {
  
});

module.exports = router;
