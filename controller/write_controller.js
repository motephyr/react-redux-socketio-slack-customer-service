var helper = require('./helper');
var path = require('path');
var fs = require('fs');
var mkdirp = require("mkdirp");

var game_id = 0;
var stage_name = '';
var visitors = [];
var user_id_file_path = {};

module.exports = function (socket, io) {

  socket.on('down_location', function (msg) {
    emit_to_server('down_location', msg);
    cache_action(msg.user_id, "down", msg.x, msg.y, msg.stamp);
  });

  socket.on('move_location', function (msg) {
    emit_to_server('move_location', msg);
    cache_action(msg.user_id, "move", msg.x, msg.y, msg.stamp);
  });

  server_control_action('up_location');
  server_control_action('submit');
  server_control_action('cancelSubmit');
  server_control_action('right');
  server_control_action('removeO');
  server_control_action('setCorrectCount');
  server_control_action('showCorrectUsers');
  server_control_action('userOut');

  // refers to: http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io
  // broadcast emit would except sender
  // socket.broadcast.emit('message', "this is a test");

  socket.on('clear', function (msg) {
    io.sockets.emit('clear', msg);
    // socket.broadcast.emit('clear', msg);
    var cid = msg.user_id;
    if (user_id_file_path[cid]) {
      cache_action(cid, "clear", null, null, msg.stamp);
    }
    //  else {
    //   renew_one(cid, true);
    // }
  });

  socket.on('clearAll', function () {
    //socket.broadcast.emit('clear');
    io.sockets.emit('clear', {});
    // renew_all(visitors, true);
  });

  socket.on('set_gameinfo_to_socket', function (msg) {
    game_id = msg.game;
    stage_name = msg.stage;
    visitors = JSON.parse(msg.visitors.replace(/&quot;/g, '"'));
  });

  socket.on('action', function (msg) {

    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('action', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('action', msg);
    });

    if (msg.action === "device_start") {
      renew_one(msg.user_id, !msg.hasTrack);
      start_cache(msg.user_id, msg.user_id, game_id, stage_name);
      cache_action(msg.user_id, "create", null, null, msg.stamp);
    } else if (msg.action === "device_stop") {
      cache_action(msg.user_id, "end", null, null, msg.stamp);
      save_action(msg.user_id);
    }


  });


  socket.on('continue_write', function (msg) {
    var uid = msg.user_id;
    if (uid && !user_id_file_path[uid]) {
      helper.emitUserId(uid, function (x) {
        io.to(x).emit('continue_write', msg);
      });
      helper.emitUserId('0', function (x) {
        io.to(x).emit('continue_write', msg);
      });

      // if (msg.has_track) {
      //   renew_one(uid, false);
      // }
    }
  });

  function server_control_action(action) {
    socket.on(action, function (msg) {
      emit_to_server(action, msg);
    });
  }

  function emit_to_server(action, msg) {
    helper.emitUserId('0', function (x) {
      io.to(x).emit(action, msg);
    });
  }

  function start_cache(uid, cid, game_id, stage) {
    var visitor = _(visitors).find(function (visitor) {
      return visitor.number == uid;
    });

    var now_time_string = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');
    var file_name = visitor.name + '_stage' + stage + '_' + now_time_string;

    ///Users/motephyr/Projects/Ruby/font_20140714/socketio/controller
    var current_path = __dirname;
    var record_path = path.resolve(current_path, "../../public/record");
    var file_path = record_path + '/game' + game_id + '/' + file_name;

    user_id_file_path[cid] = [file_path];
  }

  function cache_action(cid, action, x, y, stamp) {
    if (user_id_file_path[cid]) {
      user_id_file_path[cid].push([action, x, y, stamp]);
    }
  }

  function save_action(cid) {
    var data = user_id_file_path[cid];
    if (data) {
      user_id_file_path[cid] = null;

      // if (!user_id_file_path[cid + "-renew"]) {
      //   user_id_file_path[cid + "-renew"] = default_value;
      // }
      var file_path = data[0];
      var tosave = { file_path: data[0], renew: user_id_file_path[cid + "-renew"], cid: cid, data: data.slice(1, data.length)};
      var content = JSON.stringify(tosave);
      console.log(content);
      mkdirp(path.dirname(file_path), function (err) {
        if (err) return cb(err)
          fs.writeFile(file_path + ".json", content, function (err) {
            if (err) {
              throw 'error opening file: ' + err;
            }

            console.log('file written');

          });
      });
      // renew_one(cid, false);

    }
  }

  function renew_one(cid, renew) {
    user_id_file_path[cid + "-renew"] = renew;
  }

  function renew_all(visitors, renew) {
    _(visitors).forEach(function (n) {
      renew_one(x.number, renew);
    });
  }


  // (function () {
  //   var current_path = __dirname;
  //   var record_path = path.resolve(current_path, "../../public/record");
  //   console.log(record_path);
  // }());

};
