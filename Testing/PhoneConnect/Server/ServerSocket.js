const startServer = (socket) => {
  socket.emit("new-server-req");
  $("#start-server").hide();
  $("#login-code").show();
};

const stopServer = (ctx, socket) => {
  socket.emit("stop-server");
  $("#login-code").hide();
  $("#stop-server").hide();
  $("#start-server").show();
  $("#instructions").html("");

  clearInterval(drawingLoop);

  ctx.clearRect(0, 0, 500, 500);
  ctx.font = "20px Georgia";
  ctx.fillText("Server Not Started", 174, 240);

  localStorage.removeItem("serverCode");
};

let users = [];

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
  
  // Draw User Boxes
  drawUserBoxes(ctx, users);
};

const drawUserBoxes = (ctx, users) => {
  users.forEach((user) => {
      ctx.fillStyle = user.color;
      ctx.fillRect(user.x * 50, user.y * 50, 50, 50);
  });
};

// This is the drawing loop on the canvas.  When we setInterval assign to this.
let drawingLoop;

$(() => {
  const socket = io();

  // Check to see if server code already exists
  if (localStorage.getItem("serverCode")) {
    socket.emit("rejoin-server-request", localStorage.getItem("serverCode"));
  }

  const ctx = document.getElementById("ctx").getContext("2d");
  ctx.font = "20px Georgia";
  ctx.fillText("Server Not Started", 174, 240);

  $("#start-server").click(() => startServer(socket));
  $("#stop-server").click(() => stopServer(ctx, socket));

  socket.on("new-server-code", (data) => {
    $("#login-code").html(`Server Code: ${data}`);
    localStorage.setItem("serverCode", data);

    drawingLoop = setInterval(() => drawGrid(ctx), 1000 / 40);
    $("#stop-server").show();
    $("#instructions").html(`Please open mobile app and type in ${data}`);
  });

  socket.on("platform-handshake", () =>
    socket.emit("platform-handshake", "SERVER")
  );

  socket.on("rejoin-server-success", () => {
    $("#start-server").hide();
    $("#login-code").show();
    $("#login-code").html(`Server Code: ${localStorage.getItem("serverCode")}`);
    $("#stop-server").show();

    $("#instructions").html(
      `Please navigate to <a target="_blank" href="${window.location.href}mobile">${window.location.href}mobile</a> on your mobile device and input the code above.`
    );

    drawingLoop = setInterval(() => drawGrid(ctx), 1000 / 40);
  });

  socket.on("rejoin-server-failure", () => {
    localStorage.removeItem("serverCode");
  });

  socket.on("maximum-servers", () => {
    alert("Sorry, server limit reached");
  });

  socket.on("username-update", (usersArr) => {
    for(let i = 0; i < usersArr.length; i++) {
        $(`#u${i+1}`).text(usersArr[i].username);
        users = usersArr;
    }
  });
});
