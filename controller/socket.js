var helper = require('./helper');
var UserIds = require('./userIds');


module.exports = function (socket, io,slack_login) {

  var currentSocketIoUserId = UserIds.create(socket.request.session['user_id']);
  UserIds.setSocketIdToUserId(currentSocketIoUserId, socket.id);

  require('./application_controller')(socket, io);
  // require('./write_controller')(socket, io);

  server_control_action('new_message');


  function server_control_action(action) {
    socket.on(action, function (msg) {
      emit_to_customerservice_and_self(action, msg);
    });
  }

  function emit_to_customerservice_and_self(action, msg) {
    var channel = slack_login.getChannelGroupOrDMByID('C0C1MCEMA');
    channel.send('收到: ' + msg.name + '傳來的訊息: ' + msg.text);

    helper.emitUserId('1', function (x) {
      io.to(x).emit(action, msg);
    });
  }



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

}


