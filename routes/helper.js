var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('helper', {
    title: 'Helpers',
    _req: req,
    _res: res
  });
});

module.exports = router;
