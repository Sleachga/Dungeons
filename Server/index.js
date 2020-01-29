const port = process.env.PORT || 1997
const io = require('socket.io')(port);

console.log(`Server has started on port ${port}`);

io.on('connection', (socket) => {
    console.log(`New Connection with id ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`id ${socket.id} has disconnected`);
    });
});