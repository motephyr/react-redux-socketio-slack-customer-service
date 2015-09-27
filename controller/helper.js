
module.exports = {
      emitUserId: function emitUserId(user_id,callback){
        for (var x in client_id[user_id]){
          callback(client_id[user_id][x]);
        }
      }
}