const express = require("express");
const app = express();
const serv = require("http").Server(app);
const uuid = require("uuid");
const ip = require("ip");
const _ = require("lodash");

const Server = require("./Classes/Server");
const User = require("./Classes/User");

// Tells the server where the html file is
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/Server/PhoneConnectServer.html");
});

// Tells the server where the html file is
app.get("/mobile", function (req, res) {
  res.sendFile(__dirname + "/Mobile/PhoneConnectMobile.html");
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/Server"));
app.use(express.static(__dirname + "/Mobile"));

const port = process.env.PORT || 80;
serv.listen(port);
console.log(
  `Server started... http://localhost:${port} or ${ip.address()}:${port}`
);

const ALL_SOCKETS = {};

const MAX_SERVERS = 10;
const MAX_USERS = 4; // Maximum mobile users allowed per server
const MAX_CONNECTIONS = 100; // Maximum total connections on the page
const GRID_SIZE = 10;

const SERVERS = {};
const TAKEN_SERVER_CODES = {};
const USERS = {};

const getServerData = (server) => {
  return server.users.map((user) => {
    return {
      username: user.username,
      color: user.color,
      x: user.x,
      y: user.y,
    };
  });
};

// Object containing the sockets
const io = require("socket.io")(serv, {});

// Fires when someone opens the page
io.sockets.on("connection", (socket) => {
  if (Object.keys(ALL_SOCKETS).length >= MAX_CONNECTIONS) {
    socket.emit("server-full");
    socket.disconnect(true);
  } else {
    // Sets the user ID to a random number
    socket.id = uuid.v4();
    ALL_SOCKETS[socket.id] = socket;

    socket.emit("platform-handshake");
    socket.on("platform-handshake", (platform) => {
      switch (platform) {
        case "USER":
          console.log(`[USER-CONNECT] ${socket.id}`);
          USERS[socket.id] = new User(socket);
          break;
        case "SERVER":
          console.log(`[SERVER-CONNECT] ${socket.id}`);
          SERVERS[socket.id] = new Server(socket);
          break;
        default:
          console.log(`[UNKNOWN-CONNECT] ${socket.id}`);
      }
    });

    socket.on("username-set", (username) => {
      USERS[socket.id].username = username;

      const curServer = USERS[socket.id].server;
      const users = getServerData(curServer);

      // Initial setting of x coordinates and y coordinates
      let x, y;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (
        users.map((user) => user.x).includes(x) &&
        users.map((user) => user.y).includes(y)
      );

      USERS[socket.id].x = x;
      USERS[socket.id].y = y;

      curServer.socket.emit("username-update", users);
    });

    socket.on("arrow", (direction) => {
      switch (direction) {
        case "up":
          if (USERS[socket.id].y > 0) USERS[socket.id].y--;
          break;
        case "left":
          if (USERS[socket.id].x > 0) USERS[socket.id].x--;
          break;
        case "right":
          if (USERS[socket.id].x < 9) USERS[socket.id].x++;
          break;
        case "down":
          if (USERS[socket.id].y < 9) USERS[socket.id].y++;
          break;
        default:
          console.log("HOW DID THIS HAPPEN...");
      }

      const curServer = USERS[socket.id].server;
      const users = getServerData(curServer);
      curServer.socket.emit("username-update", users);
    });

    socket.on("set-user-color", (color) => {
      const userKeys = Object.keys(USERS);

      // Don't allow duplicate colors, TODO: send colors picked and grey out on client
      if (!userKeys.map((key) => USERS[key].color).includes(color)) {
        USERS[socket.id].color = color.color; // TODO: figure out why this is color.color and not color
      }

      if (!USERS[socket.id].x && !USERS[socket.id].y) {
        // Assign x and y values uniquely
        let x, y;
        do {
          x = Math.floor(Math.random() * 9);
          y = Math.floor(Math.random() * 9);
        } while (
          userKeys.map((key) => USERS[key].x).includes(x) &&
          userKeys.map((key) => USERS[key].y).includes(y)
        );

        USERS[socket.id].x = x;
        USERS[socket.id].y = y;
      }

      const curServer = USERS[socket.id].server;
      const users = getServerData(curServer);
      curServer.socket.emit("username-update", users);
    });

    socket.on("mobile-server-code-req", (mobileCode) => {
      if (TAKEN_SERVER_CODES[mobileCode]) {
        let foundServer;

        for (id in SERVERS) {
          if (SERVERS[id].serverCode === mobileCode) {
            foundServer = SERVERS[id];
          }
        }
        try {
          foundServer.addUser(USERS[socket.id]);
          USERS[socket.id].server = foundServer;
          socket.emit("server-code-success");
        } catch (error) {
          console.log(error);
          socket.emit("server-full");
        }
      } else {
        socket.emit("server-code-failure");
      }
    });

    socket.on("new-server-req", () => {
      if (Object.keys(SERVERS).length <= MAX_SERVERS) {
        // Generate Server Code
        let newServerCode;
        do {
          newServerCode = uuid.v4().split("-")[1].toUpperCase();
        } while (TAKEN_SERVER_CODES[newServerCode]);

        TAKEN_SERVER_CODES[newServerCode] = socket;
        SERVERS[socket.id].serverCode = newServerCode;

        socket.emit("new-server-code", newServerCode);
      } else {
        socket.emit("maximum-servers");
      }
    });

    socket.on("rejoin-server-request", (serverCode) => {
      if (TAKEN_SERVER_CODES[serverCode]) {
        socket.emit("rejoin-server-success");
      } else {
        socket.emit("rejoin-server-failure");
      }
    });

    socket.on("stop-server", () => {
      console.log(
        `[SERVER STOP]: ${_.get(SERVERS, `${socket.id}.serverCode`)}`
      );

      // TODO: There's more stuff to unset here probably
      _.unset(SERVERS, `${socket.id}.serverCode`);
    });

    // Fires when someone leaves the page
    // Deletes the socket from ALL_SOCKETS
    socket.on("disconnect", () => {
      console.log(`[DISCONNECT] ${socket.id}`);
      _.unset(USERS, `${socket.id}`);
      _.unset(SERVERS, `${socket.id}`);
      _.unset(ALL_SOCKETS, `${socket.id}`);
    });
  }
});
