var helper = require('./helper');
var UserIds = require('./userIds');

var domainToUsers = {};
// {
//   "google.com": {
//     "ceid1":[socketobject, ...],
//     "ceid2":[socketobject, ...],
//     ...
//   },
//   "yahoo.com": {
//     "ceid2":[socketobject, ...],
//     ...
//   },
//   ...
// }

var socketCache = {};
// { "ceid1-google.com": socketObject }
// client 

module.exports = function (socket, io) {

  // room string concat rule: domain and serial number

  var defaultRoom = socket.currentDomain + '-public';
  // var joinedRoom = socket.joinedRoom;

  var ceidToSocketArray = domainToUsers[socket.currentDomain];

  if(!socket.ceid){
    // socket.ceid
    var req = socket.request;
    var currentCookies = req.headers? req.headers.cookie.split(';') : [];
    while(currentCookies.length){
      var check = currentCookies.pop();
      var parts = check.match(/(.*?)=(.*)$/);
      if(parts[1].trim() == "_ce"){
        socket.ceid = (parts[2] || '').trim();
        break;
      }
    }
  }

  var cacheKey = socket.ceid + '-' + socket.currentDomain;

  // init rooms collection
  if(!socket.joinedRooms) socket.joinedRooms = [];

  if(!socket.username){
    socket.username = 'anonymous_' + (new Date()).getTime();
    socket.emit('change_name', { new_name: socket.username });
  }


  // check the users maps by specified domain
  if(!ceidToSocketArray) ceidToSocketArray = domainToUsers[socket.currentDomain] = {};

  // check if the unique id and socket object mapping
  if(!ceidToSocketArray[socket.ceid] && !socketCache[cacheKey]){

    ceidToSocketArray[socket.ceid] = [socket];

    socket.join(defaultRoom);
    socket.joinedRooms.push(defaultRoom);
    
    io.in(defaultRoom).emit('user_joined', {username: socket.username});

  }else{
    // open new tab but access same domain OR
    // refresh page / redirect to other pages on same domain
    var socketsArray = ceidToSocketArray[socket.ceid];
    var previous = (socketsArray && socketsArray.length > 0)? 
      socketsArray[socketsArray.length - 1] : socketCache[cacheKey];

    socket.joinedRooms = previous.joinedRooms.slice(0);
    socket.joinedRooms.forEach(function(r){
      socket.join(r);
    });
    
    if(socketsArray) socketsArray.push(socket);
    else ceidToSocketArray[socket.ceid] = [socket];
    
    delete socketCache[cacheKey];
    // socketCache[cacheKey] = null;
  }

  var outputUserList = [];
  for(var id in ceidToSocketArray){
    if(id != socket.ceid){
      var cs = ceidToSocketArray[id][0];
      outputUserList.push({
        id: id,
        username: cs.username
      });
    }
  }
  socket.emit("initial_list", { 
    room: defaultRoom, 
    users: outputUserList,
    currentUser: {
      id: socket.ceid,
      username: socket.username
    }
  });

  console.log("Socket connected! [" + socket.id + " in " + socket.currentDomain + "]");
  console.log(domainToUsers);
  console.log(socketCache);
  console.log("Info: " + socket.ceid + "; " + socket.username);

  socket.on('change_name', function(data){
    // Find the rooms involved by current user 
    var rooms = socket.rooms;
    var oldname = socket.username;
    socket.username = data.new_name;
    // socket.emit('change_name', { new_name: socket.username });
    // And braocast to the related sockets.
    if(rooms.length > 1){
      for(var i = 1, len = rooms.length; i < len; i++){
        io.in(rooms[i]).emit('change_name', { old_name: oldname, new_name: socket.username });
        // broacast but sender
        // socket.broadcast.to(rooms[i]).emit('change_name', { new_name: socket.username });
      }
    }
    // ...
  });

  // means dbclick the another user
  socket.on('create_room', function(data){
    // Find the room involved by current user and target users  (data.targetUsers : Array)
    var targetId = data.targetUser;
    var selfId = socket.ceid;
    // socket.join('test room');
    // var clients = io.sockets.adapter.rooms['test room'];
    // console.log(clients);
    // for (var clientId in clients) {
    //   console.log(io.sockets.connected[clientId]);
    // }

    var roomName = [socket.currentDomain,socket.ceid,(new Date()).getTime()].join('_');

    var targetSocketList = ceidToSocketArray[targetId];
    var selfSocketList = ceidToSocketArray[selfId];

    // if yes
    // ...
    // if not
      // back to the chat page for create a new iframe by this room name
      socket.emit('room_ready', { room: roomName });
      // 
      // ...
      // 
  });

  socket.on('new_message', function(data){
    socket.broadcast.to(data.room).emit('new_message', {room:data.room, message:data.message}); 
    // io.in(data.room).emit('new_message', data.message);
  });

  socket.on('disconnect', function (message) {
    // console.log(socket.currentDomain);
    // console.log(socket.rooms);
    // var joinedRooms = socket.rooms; // rooms is empty? 
    
    // remove
    var idx = ceidToSocketArray[socket.ceid].map(function(item){ return item.id; }).indexOf(socket.id);
    ceidToSocketArray[socket.ceid].splice(idx, 1);
    if(ceidToSocketArray[socket.ceid].length == 0){
      socketCache[cacheKey] = socket;
      setTimeout((function(key){
        return function(){
          var scope = socketCache[key];
          if(scope){
            scope.joinedRooms.forEach(function(name){
              io.in(name).emit("user_left", {id: scope.ceid, username: scope.username});
            });
            delete socketCache[key];
            // socketCache[key] = null;

            console.log(socketCache);
          }
        };
      })(cacheKey), 8000);
      delete ceidToSocketArray[socket.ceid];
      // ceidToSocketArray[socket.ceid] = null;
    }

    console.log("Socket disconnect! [" + socket.id + " in " + socket.currentDomain + "]");
    console.log(domainToUsers);
    console.log(socketCache);
    console.log("Info: " + socket.ceid + "; " + socket.username);

  });

}


