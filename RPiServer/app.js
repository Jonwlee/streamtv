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

/*function startStreaming(io) {
	if (app.get('watchingFile')) {
		io.sockets.emit('liveStream', frameToBase64('./stream/image_stream.jpg'));
		return;
	}

	var args = ["-w", "320", "-h", "240", "-o", "-", "-t", "999999999", "-tl", "25"];
	proc = spawn('raspistill', args);
	
	app.set('watchingFile', true);
	
	/*fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
		io.sockets.emit('liveStream', frameToBase64('./stream/image_stream.jpg'));
	});

	readline.createInterface({
	  input     : proc.stdout,
	  terminal  : false
	}).on('line', function(line) {
	  //console.log(new Buffer(line).toString('base64'));
	  io.sockets.emit('liveStream', new Buffer(line).toString('base64'));
	});
}*/

function startStreaming(io) {
	var blob;
	var SOI = false;
	var SOIChunk = false;
	var SOIPos;

	var args = [ "-w", "160", "-h", "120", "-t", "999999999", "-tl", "750", "-o", "-", "-q", "4"];
	proc = spawn("raspistill", args);
	
	proc.stdout.on("data", function(chunk) {
		if(!SOI) {
			for(var i = 0; i < chunk.length - 1; i++) {
				if(chunk.readUInt8(i) == 0xFF && chunk.readUInt8(i + 1) == 0xD8 && !SOI) {
					SOI = true;
					SOIChunk = true;
					SOIPos = i;
				}
			}
		}

		if(SOI) {
			if(SOIChunk) {
				blob = new Buffer(chunk.slice(SOIPos, chunk.length));
				SOIChunk = false;
			}
			else
				blob = Buffer.concat([blob, chunk]);
		}

		if(chunk.readUInt8(chunk.length - 2) == 0xFF && chunk.readUInt8(chunk.length - 1) == 0xD9 && SOI) {
			io.sockets.emit('liveStream', blob.toString("base64"));
			SOI = false;
		}
	});

	proc.stderr.on("data", function(err) {
		console.log(err.toString());
	})
}
