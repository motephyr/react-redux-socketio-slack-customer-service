var helper = require('./helper');


module.exports = function (io,slack) {
  slack.on('open', function () {
    open_slack();
  });
  slack.on('message', function (message) {
    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID('C0C1MCEMA');
    user = slack.getUserByID(message.user);
    response = '';
    type = message.type, ts = message.ts, text = message.text;
    channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
    console.log("Received: " + type + " " + channelName + " " + userName + " " + ts + " \"" + text + "\"");
    if (type === 'message' && (text != null) && (channel.name == 'customerservice')) {
      if (text.substring(0, 13) === '<@U0C1Y67FT>:') {
        response = text.substring(13, text.length).split(' ')
        channel.send('收到: ' + response);
        var customerName = response[0]
        console.log(customerName);
        //在這邊回給某人
        helper.emitUserId(customerName, function (x) {
          io.to(x).emit('new_message', {name: userName ,text: response[1]});
        });

      }
      return console.log("@" + slack.self.name + " responded with \"" + response + "\"");
    } else {
      typeError = type !== 'message' ? "unexpected type " + type + "." : null;
      textError = !(text != null) ? 'text was undefined.' : null;
      channelError = !(channel != null) ? 'channel was undefined.' : null;
      errors = [typeError, textError, channelError].filter(function (element) {
        return element !== null;
      }).join(' ');
      return console.log("@" + slack.self.name + " could not respond. " + errors);
    }
  })
  slack.on('error', function (err) {
    console.error("Error", err)
  })
  slack.login()

  return slack;


  function open_slack() {
    var channel, channels, group, groups, id, messages, unreads;
    channels = [];
    groups = [];
    unreads = slack.getUnreadCount();
    channels = (function () {
      var _ref, _results;
      _ref = slack.channels;
      _results = [];
      for (id in _ref) {
        channel = _ref[id];
        if (channel.is_member) {
          _results.push("#" + channel.name);
        }
      }
      return _results;
    })();
    groups = (function () {
      var _ref, _results;
      _ref = slack.groups;
      _results = [];
      for (id in _ref) {
        group = _ref[id];
        if (group.is_open && !group.is_archived) {
          _results.push(group.name);
        }
      }
      return _results;
    })();
    console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);
    console.log('You are in: ' + channels.join(', '));
    console.log('As well as: ' + groups.join(', '));
    messages = unreads === 1 ? 'message' : 'messages';
    return console.log("You have " + unreads + " unread " + messages);
  }

};
