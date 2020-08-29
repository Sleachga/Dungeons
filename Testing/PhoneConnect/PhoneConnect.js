const express = require('express');
const app = express();
const server = require('http').Server(app);
const uuid = require('uuid');
const ip = require('ip');
const _ = require('lodash');

// Tells the server where the html file is
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/Server/PhoneConnectServer.html');
});

// Tells the server where the html file is
app.get('/mobile',function(req, res) {
    res.sendFile(__dirname + '/Mobile/PhoneConnectMobile.html');
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/Server'));
app.use(express.static(__dirname + '/Mobile'));

const port = process.env.PORT || 80;
server.listen(port);
console.log(`Server started... http://localhost:${port} or ${ip.address()}:${port}`);

const ALL_SOCKETS = {};
const SERVER_SOCKETS = {};
const USER_SOCKETS = {};

const MAX_SERVERS = 10;
const MAX_USERS = 4; // Maximum mobile users allowed per server
const MAX_CONNECTIONS = 100; // Maximum total connections on the page

const SERVERS = {};
const USERS = {};

// Object containing the sockets
const io = require('socket.io')(server, {});

// Fires when someone opens the page
io.sockets.on('connection', (socket) => {
    if (ALL_SOCKETS.size >= MAX_CONNECTIONS) {
        socket.emit('server-full');
        socket.disconnect(true);
    } else {
        // Sets the user ID to a random number
        socket.id = uuid.v4();
        ALL_SOCKETS[socket.id] = socket;
        console.log(`[CONNECT] ${socket.id}`)

        socket.emit('ip', `${ip.address()}:${port}`);

        socket.on('new-server-req', () => {
            if (Object.keys(SERVER_SOCKETS).length <= MAX_SERVERS) {
            	socket.isServer = true;
           		SERVER_SOCKETS[socket.id] = socket;
           		
                // Generate Server Code
                let newServerCode;
                do {
                    newServerCode = uuid.v4().split('-')[1].toUpperCase();
                } while (SERVERS[newServerCode])   

           		SERVERS[newServerCode] = { 
                    socketId: socket.id,
                    serverCode: newServerCode,
                    users: {},
                };

                SERVER_SOCKETS[socket.id].serverCode = newServerCode;

           		console.log(`[SERVER CREATE]: ${newServerCode}`);
           		socket.emit('new-server-code', newServerCode);
            } else {
            	socket.emit('maximum-servers');
            }
        });

        socket.on('rejoin-server-request', (serverCode) => {
            if (SERVERS[serverCode]) {
                _.set(SERVER_SOCKETS, `${socket.id}.serverCode`, serverCode);
                socket.emit('rejoin-server-success');
            } else {
                socket.emit('rejoin-server-failure');
            }
        });

        socket.on('stop-server', () => {
            console.log(`[SERVER STOP]: ${_.get(SERVER_SOCKETS, `${socket.id}.serverCode`)}`);
            _.unset(SERVERS, `SERVER_SOCKETS.${socket.id}.serverCode`);
            _.unset(SERVER_SOCKETS, `${socket.id}`);
        });
        
        // Fires when someone leaves the page
        // Deletes the socket from ALL_SOCKETS
        socket.on('disconnect', () => { 
            console.log(`[DISCONNECT] ${socket.id}`);
            _.unset(SERVERS, `SERVER_SOCKETS.${socket.id}.serverCode`);
            _.unset(USER_SOCKETS, `${socket.id}`);
            _.unset(SERVER_SOCKETS, `${socket.id}`);
            _.unset(ALL_SOCKETS, `${socket.id}`);
        });
    }
});