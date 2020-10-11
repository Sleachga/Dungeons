class User {
  constructor(socket) {
    this.socket = socket;
    this.server = null;
    this.username = '';
    this.color = '#ffffff';
    this.x = NaN,
    this.y = NaN
  }
}

module.exports = User;
