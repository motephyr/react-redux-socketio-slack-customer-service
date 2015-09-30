var _ = require('lodash');


var userIds = (function () {
  var ids = {};
  var claim = function (id) {
    if (!id || ids[id]) {
      return false;
    } else {
      ids[id] = [];
      return [];
    }
  };

  //產生一個id
  var create = function (clientid) {
    if (clientid == 0) {
      return 0;
    }
    var id, nextUserId = 1;
    do {
      id = nextUserId;
      nextUserId += 1;
    } while (!claim(id));

    return id;
  };

  //取得id的List
  var getAll = function () {

    var res = [];
    for (id in ids) {
      res.push(id);
    }

    return res;
  };

  var getOne = function (id) {
    return ids[id];
  };

  //set一個socketid
  var setSocketIdToUserId = function (userId, socketId) {

    if (!ids[userId]) {
      ids[userId] = [];
    }
    ids[userId].push(socketId);
  };

  var free = function (id, socketId) {
    console.log(ids);

    ids[id] = _.filter(ids[id], function (el) {
      return el !== socketId;
    })

    if (ids[id].length == 0) {
      delete ids[id];
    }
  };

  var get_connection_status = function () {
    return _.mapValues(ids, function (n) {
      return (n.length > 0) ? true : false;
    })
  }

  return {
    claim: claim,
    free: free,
    create: create,
    setSocketIdToUserId: setSocketIdToUserId,
    getAll: getAll,
    getOne: getOne,
    get_connection_status: get_connection_status
  }


}());

module.exports = userIds;
