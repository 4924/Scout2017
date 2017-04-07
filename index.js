var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var emptyMatch = function(t=0, m=0) {
  return {"team": t, "match": m, "gears":0,"highball":0,"lowball":0,"ballload":0,"autogear":false,"autoline":false,"autolow":false,"autohigh":false,"autorope":false,"drivechain":0,"groundgear":false,"groundball":false,"player":false,"hopper":false,"macrogear":false,"macroball":false};
};

var matches = [["4924", 1, false], ["3861", 1, false], ["180", 4, false], ["5005", 5, false]];
var save = [];

app.use(express.static(path.join(__dirname, '/pub')));
app.get('/', function(req, res){
  res.sendFile('index.html');
});

app.get('/match/:id', function(req, res){
  res.sendFile(path.join(__dirname, '/pub', '/match.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('matches', matches);
  socket.on('gear', function(msg){
  save.gear = msg;
  console.log(save);
  });
  socket.on('data', function(msg){
  console.log(msg.team);
  console.log(msg.type);
  console.log(msg.data);
  while(save.length<msg.match) {
    save.push({});
  };
  if(save[msg.match-1].hasOwnProperty(msg.team)) {
    save[msg.match-1][msg.team][msg.type] = msg.data;
  } else {
    save[msg.match-1][msg.team] = emptyMatch(msg.team, msg.match);
    save[msg.match-1][msg.team][msg.type] = msg.data;
  };
  console.log(save);
  });
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
