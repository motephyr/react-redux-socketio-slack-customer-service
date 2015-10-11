

var helper = require('./helper');

var UserIds = require('./userIds');
var Slack = require('slack-client');
var slack = new Slack('xoxb-12066211537-cg2QfmDSo3lbmyQ9cJs61ZZf', true, true);

module.exports = function (socket, io) {

  var currentSocketIoUserId = UserIds.create(socket.request.session['user_id']);
  UserIds.setSocketIdToUserId(currentSocketIoUserId, socket.id);

  require('./application_controller')(socket, io);
  // require('./write_controller')(socket, io);
  require('./message_controller')(socket,io,slack);


  helper.emitUserId('0', function (x) {
    io.to(x).emit('client_connected', UserIds.get_connection_status());
  });

  socket.on('disconnect', function (message) {
    console.log("which user id " + currentSocketIoUserId);
    console.log("which socket id " + socket.id);

    UserIds.free(currentSocketIoUserId,socket.id);
    helper.emitUserId('0', function (x) {
      io.to(x).emit('client_connected', UserIds.get_connection_status());
    });
  });

  return socket;

}


