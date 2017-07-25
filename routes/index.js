var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.send('login todo');
});

router.get('/reg', function(req, res, next) {
  res.send('reg todo');
});

module.exports = router;