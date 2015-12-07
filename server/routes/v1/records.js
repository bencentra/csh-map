'use strict';

var db = require('../../models');
var models = db.models;
var express = require('express');
var router = express.Router();

// Get all records
// TODO: implement limit, offset, and pagination
router.get('/history', function(req, res) {
  models.Record.findAll({
    order: 'id DESC',
    include: [{ all: true }]
  }).then(function(records) {
    res.send(records || []);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

// Get most recent record for each user
router.get('/present', function(req, res) {
  db.sequelize.query(
    'SELECT r.id, r.MemberUid, r.LocationId, r.createdAt, r.updatedAt, m.updatedAt FROM Records r, Members m WHERE r.updatedAt = m.updatedAt GROUP BY r.MemberUid',
    { type: db.sequelize.QueryTypes.SELECT }
  ).then(function(records) {
    res.send(records || []);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

router.post('/', function(req, res) {
  var memberUid = req.body.member;
  if (!memberUid) {
    res.status(400).send({error: 'Missing member parameter'});
  }
  var locationId = req.body.location;
  if (!locationId) {
    res.status(400).send({error: 'Missing location parameter'});
  }
  models.Record.create({
    MemberUid: memberUid,
    LocationId: locationId
  }).then(function(location) {
    models.Member.update({
      updatedAt: location.updatedAt
    }, {
      where: {
        uid: memberUid
      }
    }).then(function(member) {
      res.send(location);
    }).catch(function(error) {
      res.status(500).send(error);
    })
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

module.exports = router;
