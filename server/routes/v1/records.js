'use strict';

var db = require('../../models');
var models = db.models;
var express = require('express');
var router = express.Router();

// Get all records
// TODO: implement limit, offset, and pagination
router.get('/history', function(req, res) {
  var limit = req.params.limit;
  var offset = req.params.offset;
  models.Record.getHistory(limit, offset).then(function(records) {
    res.send(records || []);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

// Get most recent record for each user
router.get('/present', function(req, res) {
  models.Record.getPresent().then(function(records) {
    res.send(records || []);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

router.post('/', function(req, res) {
  var memberUid = req.body.member;
  if (!memberUid) {
    res.status(400).send({error: 'Missing member parameter'});
    return;
  }
  var locationId = req.body.location;
  if (!locationId) {
    res.status(400).send({error: 'Missing location parameter'});
    return;
  }
  var reasonId = req.body.reason;
  if (!reasonId) {
    res.status(400).send({error: 'Missing reason parameter'});
    return;
  }
  models.Record.addRecord(memberUid, locationId, reasonId).then(function(location) {
    models.Member.setUpdatedAt(memberUid, location.updatedAt).then(function(member) {
      res.send(location);
    }).catch(function(error) {
      res.status(500).send(error);
    });
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

module.exports = router;
