'use strict';

var models = require('../models').models;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  models.Record.findAll({
    include: [{ all: true }]
  }).then(function(records) {
    res.send(records || []);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

router.post('/', function(req, res) {
  var memberUid = req.body.member;
  if (!memberUid) {
    res.send({error: 'Missing member parameter'});
  }
  var locationId = req.body.location;
  if (!locationId) {
    res.send({error: 'Missing location parameter'});
  }
  models.Record.create({
    MemberUid: memberUid,
    LocationId: locationId
  }).then(function(location) {
    res.send(location);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

module.exports = router;
