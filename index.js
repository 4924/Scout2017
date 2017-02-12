var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var save = {"gears":0,"highball":0,"lowball":0,"ballload":0,"autogear":false,"autoline":false,"autolow":false,"autohigh":false,"autorope":false,"drivechain":0,"groundgear":false,"groundball":false,"player":false,"hopper":false,"macrogear":false,"macroball":false};

app.use(express.static('pub'))
app.get('/', function(req, res){
  res.sendFile('/pub/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('gear', function(msg){
  save.gear = msg;
  console.log(save);
  });
  socket.on('data', function(msg){
  console.log(msg.team);
  console.log(msg.type);
  console.log(msg.data);
  save[msg.type] = msg.data;
  console.log(save);
  });
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
