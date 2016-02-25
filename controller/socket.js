var helper = require('./helper');
var UserIds = require('./userIds');

var domainToUsers = {};
// client 

module.exports = function (socket, io) {

  // var currentSocketIoUserId = UserIds.create(socket.request.session['user_id']);
  // UserIds.setSocketIdToUserId(currentSocketIoUserId, socket.id);

  // require('./application_controller')(socket, io);
  // // require('./write_controller')(socket, io);

  // socket.on('new_email_on_suid', function(obj){
  //   UserIds.setSocketIdToUserId(obj.email, socket.id);
  // });

  // server_control_action('new_message');

  // function server_control_action(action) {
  //   socket.on(action, function (msg) {
  //     emit_to_customerservice_and_self(action, msg);
  //   });
  // }

  // function emit_to_customerservice_and_self(action, msg) {
  //   // var channel = slack_login.getChannelGroupOrDMByID('C0C1MCEMA');
  //   // channel.send('收到: ' + msg.name + '傳來的訊息: ' + msg.text);

  //   helper.emitUserId(msg.name, function (x) {
  //     io.to(x).emit(action, msg);
  //   });
  // }

  // helper.emitUserId('0', function (x) {
  //   io.to(x).emit('client_connected', UserIds.get_connection_status());
  // });

  // room string concat rule: domain and serial number

  var defaultRoom = socket.currentDomain + '-public';
  var joinedRoom = socket.joinedRoom;

  var map = domainToUsers[socket.currentDomain];

  // check the users array by specified domain
  if(!map) map = domainToUsers[socket.currentDomain] = [];

  if(!socket.username){
    socket.username = 'anonymous_' + (new Date()).getTime();
    socket.emit('change_name', { new_name: socket.username });
  }

  if(map.indexOf(socket.username) == -1){
    // new user
    map.push(socket.username);
    socket.join(defaultRoom);
    socket.emit("initial_list", { room: defaultRoom, users: map });
    // tell others 
    io.in(defaultRoom).emit('user_joined', {username: socket.username});
  }

  if(joinedRoom){
    socket.join(joinedRoom);
    socket.broadcast.to(joinedRoom).emit('user_joined', {username: socket.username}); 
    // io.in(joinedRoom).emit('user_joined', {username: socket.username});
  }
  
  socket.on('change_name', function(data){
    // Find the rooms involved by current user 
    // And braocast to the related sockets.
  });

  // means dbclick the another user
  socket.on('create_room', function(data){
    // Find the room involved by current user and target users  (data.targetUsers : Array)
    // if yes
    // ...
    // if not
      // back to the chat page for create a new iframe by this room name
      socket.emit('room_ready', { room: [socket.currentDomain,socket.username,(new Date()).getTime()].join('-') });
      // 
      // ...
      // 
  });

  socket.on('new_message', function(data){
    socket.broadcast.to(data.room).emit('new_message', data); 
    // io.in(data.room).emit('new_message', data.message);
  });

  socket.on('disconnect', function (message) {
    var joinedRooms = socket.rooms; // rooms is empty? 
    joinedRooms.forEach(function(name){
      io.in(name).emit("user_left", {username: socket.username});
    });


    var index = map.indexOf(socket.username);
    if(index != -1) map.splice(index, 1);

    console.log("which user id " + socket.username + " in " + socket.currentDomain);
    console.log("which socket id " + socket.id);

    // UserIds.free(currentSocketIoUserId,socket.id);
    // helper.emitUserId('0', function (x) {
    //   io.to(x).emit('client_connected', UserIds.get_connection_status());
    // });
  });

}


