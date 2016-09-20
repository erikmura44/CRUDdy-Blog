var io = require('socket.io')();

io.on('connection',function(socket){
  socket.on('chat message',function(data){
    io.emit('chat message', data);
  });
});

module.exports = io;
