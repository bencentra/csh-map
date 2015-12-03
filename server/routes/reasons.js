'use strict';

var models = require('../models').models;
var express = require('express');
var router = express.Router();

router.get('/:id?', function(req, res) {
  var id = req.params.id;
  if (id) {
    models.Reason.findOne({
      where: {
        id: id
      }
    }).then(function(reason) {
      res.send(reason);
    }).catch(function(error) {
      res.send(error);
    });
  }
  else {
    models.Reason.findAll().then(function(reasons) {
      res.send(reasons);
    }).catch(function(error) {
      res.send(error);
    });
  }
});

module.exports = router;
