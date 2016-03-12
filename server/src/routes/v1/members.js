'use strict';

var models = require('../../models').models;
var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap

router.get('/:uid?', function (req, res) {
  var uid = req.params.uid;
  if (uid) {
    models.Member.findOne({
      where: {
        uid: uid
      }
    }).then(function (member) {
      res.send(member || {});
    }).catch(function (error) {
      res.status(500).send(error);
    });
  } else {
    models.Member.findAll().then(function (members) {
      res.send(members || []);
    }).catch(function (error) {
      res.status(500).send(error);
    });
  }
});

router.post('/', function (req, res) {
  var uid;
  var cn;
  uid = req.body.uid;
  if (!uid) {
    res.status(400).send({ error: 'Missing uid parameter' });
    return;
  }
  cn = req.body.cn || '';
  models.Member.addMember(uid, cn).then(function (member) {
    res.send(member[0]);
  }).catch(function (error) {
    res.status(500).send(error);
  });
});

router.put('/:uid', function (req, res) {
  var uid;
  var cn;
  uid = req.params.uid;
  if (!uid) {
    res.status(400).send({ error: 'Missing uid parameter' });
    return;
  }
  cn = req.body.cn || '';
  models.Member.setName(uid, cn).then(function (member) {
    if (member[0] === 1) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  }).catch(function (error) {
    res.status(500).send(error);
  });
});

module.exports = router;
