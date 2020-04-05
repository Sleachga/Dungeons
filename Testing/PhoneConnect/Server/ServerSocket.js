const startServer = (socket) => {     
    socket.emit('new-server-req');
    $('#create-server').hide();
    $('#login-code').show();
}

const GRID_WIDTH = 50;
const drawGrid = (ctx) => {
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, 500, 500);
    // Draw Lines
    for (let i = 50; i < 500; i += GRID_WIDTH) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 500);
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
    }
    ctx.stroke();
}

$(() => {
    const socket = io();

    $('#create-server').click(() => startServer(socket));

    const ctx = document.getElementById("ctx").getContext("2d");
    ctx.font = "20px Georgia";
    ctx.fillText("Server Not Started", 174, 240);

    socket.on('new-server-code', (data) => {
        $('#login-code').html(`Server Code: ${data}`);
        setInterval(() => drawGrid(ctx), 1000 / 40)
    });
})