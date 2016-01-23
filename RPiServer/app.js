var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn;
var proc;

app.use('/', express.static(path.join(__dirname, 'stream')));


app.get('/', function(req, res) {
	//res.sendFile(__dirname + '/index.html');
	/*var io = require('socket.io').listen(server);
	var sockets = {};*/

	var args = ["-rot" "180" "-o" "-" "-t" "0" "-hf" "-w" "800" "-h" "400" "-fps" "24" "|cvlc" "-vvv" "stream:///dev/stdin" "--sout" "'#standard{access=http,mux=ts,dst=:8160}'" ":demux=h264"];
	var stream = spawn('raspivid', args);

	stream.stdout.on('data', function (data) {
		console.log(data);
	});

	/*var options = {
	    url: '45.56.97.252/streamtv',
	    form: {
	      get_stream: "data"
	    },
	    json: true
	};

	request.get(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
      	console.log("Connected");
      } 
      else {
        console.log("No connection");
      }
    });*/

	/*io.sockets.on('connection', function (socket) {
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

		socket.on('start-stream', function() {
			startStreaming(io);
		});
	});*/
});

/*http.listen(3000, function() {
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
		io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
		return;
	}
	
	var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "30"];
	proc = spawn('raspistill', args);
	
	console.log('Watching for changes...');
	
	app.set('watchingFile', true);
	
	fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
		io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
	});
}*/