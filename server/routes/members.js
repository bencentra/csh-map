'use strict';

var models = require('../models').models;
var express = require('express');
var router = express.Router();

router.get('/:uid?', function(req, res) {
  var uid = req.params.uid;
  if (uid) {
    models.Member.findOne({
      where: {
        uid: uid
      }
    }).then(function(member) {
      res.send(member || {});
    }).catch(function(error) {
      res.send(error);
    });
  }
  else {
    models.Member.findAll().then(function(members) {
      res.send(members || []);
    }).catch(function(error) {
      res.send(error);
    });
  }
});

router.post('/', function(req, res) {
  var uid = req.body.uid;
  if (!uid) {
    res.send({error: 'Missing uid parameter'});
  }
  var cn = req.body.cn || '';
  models.Member.create({
    uid: uid, 
    cn: cn
  }).then(function(member) {
    res.send(member);
  }).catch(function(error) {
    res.send(error);
  });
});

router.put('/:uid', function(req, res) {
  var uid = req.params.uid;
  if (!uid) {
    res.send({error: 'Missing uid parameter'});
  }
  var cn = req.body.cn || '';
  models.Member.update({
    cn: cn
  }, {
    where: {
      uid: uid
    }
  }).then(function(member) {
    res.send(member);
  }).catch(function(error) {
    res.send(error);
  });
});

module.exports = router;
