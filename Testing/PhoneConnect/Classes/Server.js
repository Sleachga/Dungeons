class Server {
  constructor(socket) {
    this.socket = socket;
    this.users = [];
    this.serverCode = null;

    this.MAX_USERS = 4;
  }

  /**
   * @description Adds a user object to the server
   * @throws Error on max users reached
   */
  addUser(user) {
    if (this.users.length >= this.MAX_USERS) {
      throw new Error("Maximum Users Reached");
    } else {
      this.users.push(user);
    }
  }
}

module.exports = Server;