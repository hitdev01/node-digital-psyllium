var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var connects = [];
var colors = new Array('#FFFFFF','#F0F000','#FF0000','#00FF00','#0000FF');
var count = 0;
var data = [
  {beacon: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D:63702:403', color: '#FFFFFF'},
  {beacon: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D:10030:8157', color: '#FFFFFF'},
  {beacon: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D:19327:30379', color: '#FFFFFF'}
];

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server})
console.log("websocket server created");

wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(data), function() {  });
    console.log('send message: '+ JSON.stringify(data));
  }, 1000);

  console.log('websocket connection open');
  // 接続してきたソケットを格納
  connects.push(ws);
  console.log('connected sockets: ' + connects.length);


  ws.on('message', function(message) {
    console.log('get message['+ message +']');
    broadcast(message);
  })

  ws.on('close', function() {
    console.log('websocket connection close');
    // 接続切れのソケットを配列から除外
    connects = connects.filter(function (conn, i) {
        return (conn === ws) ? false : true;
    });
    console.log('connected sockets: ' + connects.length);
    clearInterval(id);
  })
})

setInterval(function chengecolor() {
  var color1;
  var color2;
  var color3;
  // var index = Math.floor(Math.random() * (colors.length));
  if (count < colors.length - 2) {
    count = count + 1;
  } else {
    count = 0;
  }
  if (count < colors.length - 3) {
    console.log('count < colors.length - 3');
    color1 = colors[count];
    color2 = colors[count+1];
    color3 = colors[count+2];
  } else if (count < colors.length - 2) {
    console.log('count < colors.length - 2');
    color1 = colors[count];
    color2 = colors[count+1];
    color3 = colors[0];
  } else if (count < colors.length - 1) {
    console.log('count < colors.length - 1');
    color1 = colors[count];
    color2 = colors[0];
    color3 = colors[1];
  } else {
    console.log('else count:' + count + ', colors.length' + colors.length);
  }
  data[0].color = color1;
  data[1].color = color2;
  data[2].color = color3;

}, 5000);
