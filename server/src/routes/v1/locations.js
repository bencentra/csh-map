'use strict';

var models = require('../../models').models;
var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap

router.get('/:id?', function (req, res) {
  var id = req.params.id;
  if (id) {
    models.Location.findOne({
      where: {
        id: id
      }
    }).then(function (location) {
      res.send(location || {});
    }).catch(function (error) {
      res.status(500).send(error);
    });
  } else {
    models.Location.findAll().then(function (locations) {
      res.send(locations || []);
    }).catch(function (error) {
      res.status(500).send(error);
    });
  }
});

router.post('/', function (req, res) {
  var addr;
  var lat;
  var lon;
  addr = req.body.address;
  if (!addr) {
    res.status(400).send({ error: 'Missing address parameter' });
    return;
  }
  lat = req.body.latitude;
  if (!lat) {
    res.status(400).send({ error: 'Missing latitude parameter' });
    return;
  }
  lon = req.body.longitude;
  if (!lon) {
    res.status(400).send({ error: 'Missing longitude parameter' });
    return;
  }
  models.Location.addLocation(addr, lat, lon).then(function (location) {
    res.send(location[0]);
  }).catch(function (error) {
    res.status(500).send(error);
  });
});

module.exports = router;
