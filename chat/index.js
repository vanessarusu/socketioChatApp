var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var user = 'rhaaf';
var name = 'test';

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var numUsers = 0;

io.on('connection', function(socket){
  var count = io.sockets.clients();
  socket.username='';


  socket.on('newUser', function(username){
    io.emit('chat message',username +' has connected');
    // socket.emit('setUser');

    console.log(username);
    this.username = username;
    console.log(username);

  });






  socket.on('chat message', function(msg){
  	io.emit('chat message', socket.username+': '+msg);
    // console.log('message: ' + msg);
  });



  socket.on('disconnect', function(){
    console.log('a user disconnected');
    io.emit('disconnect', socket.username+': disconnected');
  });

});


http.listen(3000, function(){
  console.log('listening on port 3000');
});