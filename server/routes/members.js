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
      res.status(500).send(error);
    });
  }
  else {
    models.Member.findAll().then(function(members) {
      res.send(members || []);
    }).catch(function(error) {
      res.status(500).send(error);
    });
  }
});

router.post('/', function(req, res) {
  var uid = req.body.uid;
  if (!uid) {
    res.send({error: 'Missing uid parameter'});
  }
  var cn = req.body.cn || '';
  models.Member.findOrCreate({
    where: {
      uid: uid
    }, 
    defaults: {
      cn: cn
    }
  }).then(function(member) {
    res.send(member[0]);
  }).catch(function(error) {
    res.status(500).send(error);
  });
});

router.put('/:uid', function(req, res) {
  var uid = req.params.uid;
  if (!uid) {
    res.status(400).send({error: 'Missing uid parameter'});
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
    res.status(500).send(error);
  });
});

module.exports = router;
