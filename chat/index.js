var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3004;
var rug = require('random-username-generator');
rug.setSeperator('_');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('request name', function() {
    console.log('request recieved');
    socket.emit('send name', rug.generate());
  });
  socket.on('chat message', function(message) {
    io.emit('chat message', message);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
