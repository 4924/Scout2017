var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs =require("fs");

try {
  var save = fs.readFileSync("data.txt");
} catch(err) {
  fs.writeFileSync('data.txt', '{}');
  var content = fs.readFileSync("data.txt");
}

content = JSON.parse(content);

var emptyMatch = function(t=0, m=0) {
  return {"team": t, "match": m, "done":false, "gears":0,"highball":0,"lowball":0,"ballload":0,"autogear":false,"autoline":false,"autolow":false,"autohigh":false,"autorope":false,"drivechain":0,"groundgear":false,"groundball":false,"player":false,"hopper":false,"macrogear":false,"macroball":false};
};

var matches = [["4740", 1, false], ["2010", 1, false], ["6373", 1, false], ["6491", 1, false], ["2386", 2, false], ["5005", 2, false], ["69", 2, false], ["5053", 3, false], ["343", 3, false], ["2973", 4, false], ["538", 4, false], ["5721", 4, false], ["1758", 5, false], ["6366", 5, false], ["5616", 6, false], ["1369", 6, false], ["6055", 6, false]];
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
  socket.on('lock', function(msg){
  console.log(msg.team);
  console.log(msg.match);
  save[msg.match-1][msg.team]["done"] = true;
  for(i in matches) {
    if((matches[i][0] == msg.team) && (matches[i][1] == msg.match)) {
      matches[i][2] = true;
    };
  };
  console.log(matches);
  fs.writeFileSync('data.txt', JSON.stringify(save));
  });
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
