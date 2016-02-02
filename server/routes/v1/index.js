var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send({message: 'Greetings from the CSH Map API (v1)'});
});

module.exports = router;
