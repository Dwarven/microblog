var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});

router.get('/login', function(req, res, next) {
  res.send('login todo');
});

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: '注册' });
});

module.exports = router;
