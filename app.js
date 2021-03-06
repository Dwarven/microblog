var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');

var index = require('./routes/index');
var users = require('./routes/users');
var helper = require('./routes/helper');

var app = express();

var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var fs = require('fs');
var accessLogfile = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
var errorLogfile = fs.createWriteStream(path.join(__dirname, 'error.log'), {flags: 'a'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined', {stream: accessLogfile}));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave:false,
  saveUninitialized: true,
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    url: 'mongodb://localhost/' + settings.db,
    host: settings.host,
  })
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.user=req.session.user;
  res.locals.error=req.flash('error').toString();
  res.locals.success=req.flash('success').toString();
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/helper', helper);

app.locals.inspect = function(obj) {
  return util.inspect(obj);
};

app.locals.headers = function(req, res) {
  return req.headers;
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (req.app.get('env') === 'production') {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
  }
  res.locals.error = req.app.get('env') === 'development' ? err : '';

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
