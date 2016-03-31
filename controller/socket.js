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

var domainToRooms = {};
// {
//   "google.com": {
//     "room1":[ceid, ...],
//     "room2":[ceid, ...],
//     ...
//   },
//   "yahoo.com": {
//     "room3":[ceid, ...],
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

  var roomToCeidArray = domainToRooms[socket.currentDomain];

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
    socket.emit('change_username_cookie', { username: socket.username });
  }


  // check the rooms maps by specified domain
  if(!roomToCeidArray) roomToCeidArray = domainToRooms[socket.currentDomain] = {};

  // check the users maps by specified domain
  if(!ceidToSocketArray) ceidToSocketArray = domainToUsers[socket.currentDomain] = {};

  // check if the unique id and socket object mapping
  if(!ceidToSocketArray[socket.ceid] && !socketCache[cacheKey]){

    ceidToSocketArray[socket.ceid] = [socket];

    socket.join(defaultRoom);
    socket.joinedRooms.push(defaultRoom);

    if(!roomToCeidArray[defaultRoom]) roomToCeidArray[defaultRoom] = [];
    roomToCeidArray[defaultRoom].push(socket.ceid);

    // io.in(defaultRoom).emit('user_joined', {id:socket.ceid, username: socket.username});
    socket.broadcast.to(defaultRoom).emit('user_joined', {id:socket.ceid, username: socket.username} );

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
    // And braocast to the related sockets.
    if(rooms.length > 1){
      for(var i = 1, len = rooms.length; i < len; i++){
        // io.in(rooms[i]).emit('change_name', { id: socket.ceid, username: socket.username });
        // broacast but sender
        socket.broadcast.to(rooms[i]).emit('change_name', { id: socket.ceid, username: socket.username });
      }
    }
    socket.emit('change_username_cookie', { username: socket.username });
  });

  // means dbclick the another user
  socket.on('create_room', function(data){
    var targetId = data.targetUser;
    var selfId = socket.ceid;
    var roomName;
    
    // check if duplicate room
    for(var room in roomToCeidArray){
      if(room == defaultRoom) continue;
      var checkList = roomToCeidArray[room];
      if(checkList.length == 2 && checkList.indexOf(targetId) != -1 && checkList.indexOf(selfId) != -1){
        roomName = room;
        // maybe duplicate rooms when participations are more than two
      }
    }

    if(!roomName){
      // create a random name for the room.
      roomName = [socket.currentDomain,socket.ceid,(new Date()).getTime()].join('_');
      var targetSocketList = ceidToSocketArray[targetId] || [];
      var selfSocketList = ceidToSocketArray[selfId] || [];

      // join the sockets for two users.
      (targetSocketList.concat(selfSocketList)).forEach(function(s){
        s.join(roomName);
        s.joinedRooms.push(roomName);
      });

      // mapping a room to participate users.
      if(!roomToCeidArray[roomName]) roomToCeidArray[roomName] = [];
      roomToCeidArray[roomName].push(targetId);
      roomToCeidArray[roomName].push(selfId);

    }

    // socket.emit('room_ready', { room: roomName });
    io.in(roomName).emit("room_ready", { room: roomName } );

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
              var clist = roomToCeidArray[name];
              if(clist){
                clist.splice(clist.indexOf(scope.ceid), 1);
                if(clist.length == 0) delete roomToCeidArray[name];
              }
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


