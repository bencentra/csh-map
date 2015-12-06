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
  var requestBody = (typeof req.body === 'string' && req.body.length > 0) ? JSON.parse(req.body) : req.body;
  var member = requestBody.member;
  if (typeof member === 'undefined') {
    res.status(400).send({error: 'Missing member parameter'});
  }
  else if (typeof member !== 'object' && typeof member !== 'string') {
    console.log(typeof member);
    res.status(400).send({error: 'Parameter member must be either a string or an object'});
  }
  var location = requestBody.location;
  if (typeof location === 'undefined') {
    res.status(400).send({error: 'Missing location parameter'});
  }
  else if (typeof location !== 'object' && !parseInt(location)) {
    console.log(typeof location);
    res.status(400).send({error: 'Parameter location must be either an integer or an object'});
  }
  var payload = {};
  if (typeof member === 'object') {
    payload.Member = member;
  }
  else {
    payload.MemberUid = member;
  }
  if (typeof location === 'object') {
    payload.Location = location;
  }
  else {
    payload.LocationId = parseInt(location);
  }
  models.Record.create(
    payload,
    { include: [{ all: true }] }
  ).then(function(location) {
    res.send(location);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

module.exports = router;
