var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var readline      = require('readline');
var proc;

app.use('/', express.static(path.join(__dirname, 'stream')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var sockets = {};

io.on('connection', function(socket) {
	sockets[socket.id] = socket;
	console.log("Total clients connected : ", Object.keys(sockets).length);
	socket.on('disconnect', function() {
		delete sockets[socket.id];
		
		if (Object.keys(sockets).length == 0) {
			app.set('watchingFile', false);
			
			if (proc) proc.kill();
			fs.unwatchFile('./stream/image_stream.jpg');
		}
	});
	socket.on('start-stream', function(data) {
		startStreaming(io);
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

function stopStreaming() {
	if (Object.keys(sockets).length == 0) {
		app.set('watchingFile', false);
		
		if (proc) proc.kill();
		fs.unwatchFile('./stream/image_stream.jpg');
	}
}

function startStreaming(io) {
	if (app.get('watchingFile')) {
		io.sockets.emit('liveStream', frameToBase64('./stream/image_stream.jpg'));
		return;
	}

	var args = ["-w", "320", "-h", "240", "-o", "-", "-t", "999999999", "-tl", "10"];
	proc = spawn('raspistill', args);
	
	app.set('watchingFile', true);
	
	/*fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
		io.sockets.emit('liveStream', frameToBase64('./stream/image_stream.jpg'));
	});*/

	readline.createInterface({
	  input     : proc.stdout,
	  terminal  : false
	}).on('line', function(line) {
	  console.log(line);
	});
}

function frameToBase64(fileName){
	var bitmap = fs.readFileSync(fileName);
    return new Buffer(bitmap).toString('base64');
}
