class Session {
  static getAccessToken() {
    return Parse.User.current().getSessionToken();
  }
}

module.exports = Session;
