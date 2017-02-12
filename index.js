var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('pub'))
app.get('/', function(req, res){
  res.sendFile('/pub/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('gear', function(msg){
  console.log('gear: ' + msg);
  });
  socket.on('highball', function(msg){
  console.log('highball: ' + msg);
  });
  socket.on('ballload', function(msg){
  console.log('ballload: ' + msg);
  });
  socket.on('lowball', function(msg){
  console.log('lowball: ' + msg);
  });
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
