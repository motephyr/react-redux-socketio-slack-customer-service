var helper = require('./helper');


module.exports = function (socket, io) {


  server_control_action('new_message');


  function server_control_action(action) {
    socket.on(action, function (msg) {
      emit_to_customerservice_and_self(action, msg);
    });
  }

  function emit_to_customerservice_and_self(action, msg) {
    helper.emitUserId('0', function (x) {
      io.to(x).emit(action, msg);
    });
    helper.emitUserId('1', function (x) {
      io.to(x).emit(action, msg);
    });
  }


};
