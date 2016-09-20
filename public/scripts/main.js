$(document).ready(function(){
  $('.content').dotdotdot ()
});


$(function(){
  var socket = io();
  $('.chatBox').submit(function(event){
    event.preventDefault();
    var message = $('.messageInput').val();
    var user_username = $('.user_username').val();
    console.log(message);
    socket.emit('chat message', {message: message, user_username: user_username});
    $(".messageInput").val("");
  });
  socket.on('chat message', function(messageData){
    $('.messages').append(`<li><strong>${messageData.user_username}: </strong>${messageData.message}</li>`);
  });
});
