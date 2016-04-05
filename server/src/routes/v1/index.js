var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap

router.get('/', function (req, res) {
  res.send({ message: 'Greetings from the CSH Map API (v1)' });
});

module.exports = router;
