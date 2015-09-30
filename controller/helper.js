var UserIds = require('./userIds');


module.exports = {
      emitUserId: function emitUserId(user_id,callback){
        for (var x in UserIds.getOne(user_id)){
          callback(UserIds.getOne(user_id)[x]);
        }
      }
}