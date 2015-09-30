var helper = require('./helper');
var UserIds = require('./userIds');


module.exports = function (socket, io) {
  socket.on('is_connected', function (msg) {
    var target_id = msg.check_id;

    helper.emitUserId(msg.user_id, function (x) {
      var client_length = UserIds.getAll().length;
      io.to(x).emit('is_connected', {check_id: msg.check_id, connected: client_length});
    });
  });

  socket.on('reset', function (msg) {
    //socket.broadcast.emit('reset', msg);
    io.sockets.emit('reset', msg);
  });

};