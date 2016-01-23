var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

server.listen(process.env.PORT || 8888, function(){
  console.log("Express server listening on port %d", this.address().port);
});

app.get('/streamtv', function(req, res) {
  var io = require('socket.io').listen(server);
  var socket = io.connect('http://'+req.ip, {reconnect: true});

  socket.on('liveStream', function(url) {
    io.sockets.emit('liveStream', url);
  });

  socket.on('connect', function(socket) { 
    console.log('Connected!');
  });

});

app.get('/streamios', function(req, res) {

});

app.get('/', function(req, res) {
  
});