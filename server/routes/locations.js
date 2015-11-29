'use strict';

var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/:id?', function(req, res) {
  var id = req.params.id;
  if (id) {
    models.Location.findOne({
      where: {
        id: id
      }
    }).then(function(location) {
      res.send(location || {});
    }).catch(function(error) {
      res.send(error);
    });
  }
  else {
    models.Location.findAll().then(function(locations) {
      res.send(locations || []);
    }).catch(function(error) {
      res.send(error);
    });
  }
});

router.post('/', function(req, res) {
  var addr = req.body.address;
  if (!addr) {
    res.send({error: 'Missing address parameter'});
  }
  var lat = req.body.latitude;
  if (!lat) {
    res.send({error: 'Missing latitude parameter'});
  }
  var lon = req.body.longitude;
  if (!lon) {
    res.send({error: 'Missing longitude parameter'});
  }
  models.Location.create({
    address: addr, 
    latitude: lat, 
    longitude: lon
  }).then(function(location) {
    res.send(location);
  }).then(function(error) {
    res.send(error);
  });
});

module.exports = router;
