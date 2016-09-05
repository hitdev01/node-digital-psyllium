var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

/*
* Express
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
* Socket.IO
*/
var colors = new Array('#000000','#FFFFFF','#F0F000','#FF0000','#00FF00','#0000FF');
var http = require('http');
//サーバインスタンス作成
var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end('server connected');
});
var io = require('socket.io').listen(server);
server.listen(8888);

//io.sockets.use(cookieParser);
io.sockets.on('connection', function(socket){
  console.log('connected');
  socket.on('set uuid', function(uuid){
    console.log('set uuid['+ uuid +']');
      socket.emit('ready');
  });

  socket.on('set beacon',function(data){
    console.log('set beacon '+ JSON.stringify(data));
    var color = getcolor();
    socket.emit('set color', color);
  });

});

function getcolor() {
  var index = Math.floor(Math.random() * (colors.length + 1));
  return colors[index];
}

module.exports = app;
