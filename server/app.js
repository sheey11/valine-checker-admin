var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var session = require('express-session');
var LokiStore = require('connect-loki')(session);
var proxyMiddleware = require('http-proxy-middleware');

var indexRouter = require('./routes/login');
var actionRouter = require('./routes/actions');

var app = express();

app.use(session({
  secret: ['23w6x7TExZY36xMX', 'toLxL6t6n6z86i3H', 'bKKmGoY4V6Bw2876', 'wdt4pnfy86Z78EF2'],
  name: 'valine-checker-server',
  cookie: {maxAge: 1 * 60 * 60 * 1000 }, // 1 hour
  store: new LokiStore(),
  resave: false,
  saveUninitialized: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', actionRouter)
app.use(history());

// in dev
var env = process.env.NODE_ENV || 'development';
if(env == 'development'){
  // proxy for vue
  var proxyOption = {
    target: 'http://localhost:8080',
    changeOrigoin: true,
    ws: true,
  }

  app.use(proxyMiddleware.createProxyMiddleware(proxyOption));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    code: err.status || 500,
    msg: err.message,
  })
});

module.exports = app;
