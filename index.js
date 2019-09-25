var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port1 = process.env.PORT||3000; 

connectedUsers = [];
app.use(express.static('public'));
server.listen(port1);1
console.log('Server started.');

io.sockets.on('connection' , clientConnected);

function clientConnected(socket){
    socket.nickname = '';   
    console.log('Client  ' + socket.handshake.address + '  connected.');
    socket.on('disconnect' , function (){
        console.log('Client  ' + socket.handshake.address + '  disconnected.');
        if (socket.nickname != ''){
            socket.broadcast.emit('system message' , 'User <b>' + socket.nickname + '</b> has left the chat-room.');
            connectedUsers.splice(connectedUsers.indexOf(socket),1);
            updateConnectedUsers();
        }
    });

    socket.on('send message' , sendMessage);
    // socket.on('send messsage', function (data) {
    //     io.sockets.in(socket.room).emit('new message', {msg: data, user: socket.username});
    // });

    socket.on('new client nickname', function(nickname){
        socket.nickname = nickname;
        connectedUsers.push(socket);
        socket.broadcast.emit('system message' , 'User <b>' + socket.nickname + '</b> has joined the chat-room.');
        updateConnectedUsers();
    });
    // socket.on('is typing', function(data){
    //     socket.broadcast.emit('typing', {nickname: data.nickname});
    //    });
}

function sendMessage(message){
    io.sockets.emit('new message' , message);
}

function updateConnectedUsers(){
    nicknames = [];
    for (i=0 ; i<connectedUsers.length ; i++){
        nicknames.push(connectedUsers[i].nickname);
    }
    io.sockets.emit('update current users' , nicknames);
}

