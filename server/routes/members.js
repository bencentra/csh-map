'use strict';

var models = require('../models');
var express = require('express');
var router = express.Router();

// router.get('/members', function(req, res) {

// });

router.get('/members/:id', function(req, res) {
  var id = req.params.id;
  models.Member.findById(id).then(function(member) {
    res.send(member);
  });
});

router.post('/members', function(req, res) {
  
});

router.put('/members/:id', function(req, res) {

});

router.delete('/members/:id', function(req, res) {

});

module.exports = router;
