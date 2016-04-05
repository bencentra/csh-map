'use strict';

var db = require('../../models');
var models = db.models;
var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap

// Get most recent record for each user
router.get('/', function (req, res) {
  models.Record.getPresent().then(function (records) {
    res.send(records || []);
  }).catch(function (error) {
    res.status(500).send(error);
  });
});

router.post('/', function (req, res) {
  var memberUid;
  var locationId;
  var reasonId;
  memberUid = req.body.MemberUid;
  if (!memberUid) {
    res.status(400).send({ error: 'Missing MemberUid parameter' });
    return;
  }
  locationId = req.body.LocationId;
  if (!locationId) {
    res.status(400).send({ error: 'Missing LocationId parameter' });
    return;
  }
  if (locationId < 0) {
    locationId = null;
  }
  reasonId = req.body.ReasonId;
  if (!reasonId) {
    res.status(400).send({ error: 'Missing ReasonId parameter' });
    return;
  }
  models.Record.addRecord(memberUid, locationId, reasonId).then(function (record) {
    models.Member.setUpdatedAt(memberUid, record.updatedAt).then(function () {
      res.send(record);
    }).catch(function (error) {
      res.status(500).send(error);
    });
  }).catch(function (error) {
    res.status(500).send(error);
  });
});

// Get all records
// TODO: implement limit, offset, and pagination
router.get('/history', function (req, res) {
  var limit = req.params.limit;
  var offset = req.params.offset;
  models.Record.getHistory(limit, offset).then(function (records) {
    res.send(records || []);
  }).catch(function (error) {
    res.status(500).send(error);
  });
});

module.exports = router;
