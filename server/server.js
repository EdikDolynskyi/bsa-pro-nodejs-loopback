'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var socket = require(path.join(__dirname, '../common/services/Socket'));

var app = module.exports = loopback();


// view engine setup
app.set('views', path.join(__dirname, '../client/views'));
console.log(__dirname)
app.set('view engine', 'pug');

app.use(loopback.static(path.join(__dirname, '/../client/public')));

app.get('/', (req, res, next) => {
  res.render('tasks');
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    socket.listen(app.start());
});
