var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var whoIsTyping = new Array();
var activeUsers = new Array();


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.username='';
  io.emit('update active users', activeUsers);

  // when a newUser event comes in, take in the username
  // emit a chat message event back, pass it the username and string
  // store the username variable of this socket instance
  // push the username to the avtive user array, and emit event to update the users list

  socket.on('newUser', function(username){
    io.emit('chat message','<span class="connectionCheck">'+username +' has connected</span>');
    this.username = username;
    activeUsers.push(username);
    io.emit('update active users', activeUsers);
  });

  //event comes in when user connects or disconnects
  // emit the event, passing in the array of active users

  socket.on('update active users', function(e) {
    io.emit('update active users', activeUsers);
  });

  // event comes in when user starts typing
  // if the username does not already exist in the array of people currently typing
  // push the username to the array

  socket.on('send username to array', function(e){
    if(whoIsTyping.indexOf(socket.username)==-1) {
      whoIsTyping.push(socket.username);
    }
  });


  // when a user is typing event comes in
  // emit the event back, passing in the array of who is typing

  socket.on('user typing', function(e){
    io.emit('user typing', whoIsTyping);
  });

  // when the not typing event comes in
  // find where the username is in the array of people typing
  // delete the username from the array
  // emit the not typing event back, passing it the updated array

  socket.on('not typing', function(e){
    var index = whoIsTyping.indexOf(socket.username);
    whoIsTyping.splice(index, 1);
    io.emit('user typing', whoIsTyping);
  });



  // when a chat message event comes in with parameter
  // add the username of this socket instance
  // emit the event back out

  socket.on('chat message', function(msg){
  	io.emit('chat message', '<span class="name">'+socket.username+':</span> '+msg);
  });

  // when the disconnect event comes in, emit the event back
  // pass the username variable of this socket with a string
  // remove the username from the array of active users

  socket.on('disconnect', function(){
    var index = whoIsTyping.indexOf(socket.username);
    if(index!=-1) {
      whoIsTyping.splice(index, 1);
    }
    io.emit('user typing', whoIsTyping);
    if(socket.username) {
    io.emit('disconnect', '<span class="connectionCheck">'+socket.username+' disconnected</span>');
    }
    var active = activeUsers.indexOf(socket.username);
    activeUsers.splice(active, 1);
    io.emit('update active users', activeUsers);
  });

});


http.listen(3000, function(){
  console.log('listening on port 3000');
});