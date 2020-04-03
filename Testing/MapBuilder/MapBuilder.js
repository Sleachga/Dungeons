const DEBUG = false;

// Prevents going back or forward a page by two finger swipe
document.body.addEventListener('wheel', function (e) { e.preventDefault(); });

let WIDTH = window.innerWidth; // Width of browser window at gameload
let HEIGHT = window.innerHeight; // Height of browser window at gameload

// Creates an object for the canvas
const ctx = document.getElementById("ctx").getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.font = '30px Arial';

$(window).resize(function () {
    ctx.canvas.width = $(window).width();
    ctx.canvas.height = $(window).height();
    WIDTH = $(window).width();
    HEIGHT = $(window).height();
});

// const roomOptions = {
//     UP:     ['U', 'UR', 'UD', 'UL', 'URD', 'URL', 'UDL', 'URDL'],
//     RIGHT:  ['R', 'UR', 'RD', 'RL', 'URD', 'URL', 'RDL', 'URDL'],
//     DOWN:   ['D', 'UD', 'RD', 'DL', 'URD', 'UDL', 'RDL', 'URDL'],
//     LEFT:   ['L', 'UL', 'RL', 'DL', 'URL', 'UDL', 'RDL', 'URDL']
// }

// More Hallways
const roomOptions = {
    UP:     ['U', 'UR', 'UR', 'UD', 'UD', 'UD', 'UD', 'UL', 'UL', 'URD', 'URL', 'UDL', 'URDL'],
    RIGHT:  ['R', 'UR', 'UR', 'RD', 'RD', 'RL', 'RL', 'RL', 'RL', 'URD', 'URL', 'RDL', 'URDL'],
    DOWN:   ['D', 'UD', 'UD', 'UD', 'UD', 'RD', 'RD', 'DL', 'DL', 'URD', 'UDL', 'RDL', 'URDL'],
    LEFT:   ['L', 'UL', 'UL', 'RL', 'RL', 'RL', 'RL', 'DL', 'DL', 'URL', 'UDL', 'RDL', 'URDL']
}

let numRooms = 0;
let doorwaysRemain = true;

const pickRandomRoom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const floor = [];

const roomExistsAtCoords = (x, y) => {
    return floor.some((room) => room.x === x && room.y === y);
}

// Find center
let center = { x: WIDTH / 2, y: HEIGHT / 2};

const drawRoom = (x, y) => {
    // Draw Big White Square on bottom
    ctx.fillStyle = 'white';
    ctx.fillRect(center.x - 25 + (50 * x), center.y - 25 + (50 * y), 50, 50);

    // Draw 1px smaller Black Square in middle
    ctx.fillStyle = 'black';
    ctx.fillRect(center.x - 24 + (50 * x), center.y - 24 + (50 * y), 48, 48);

    // Draw Small White Square On Top
    ctx.fillStyle = 'white';
    ctx.fillRect(center.x - 20 + (50 * x), center.y - 20 + (50 * y), 40, 40);
}

const drawStart = () => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill(); 
}

const drawEnd = () => {
    const end = floor[floor.length - 1];
    ctx.beginPath();
    ctx.arc(center.x + (50 * end.x), center.y + (50 * end.y), 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill(); 
}

class Room {
    constructor(roomCode, x, y) {
        this.id = numRooms;
        this.up = roomCode.includes('U');
        this.right = roomCode.includes('R');
        this.down = roomCode.includes('D');
        this.left = roomCode.includes('L');

        this.roomUp = null;
        this.roomRight = null;
        this.roomDown = null;
        this.roomLeft = null;

        this.x = x;
        this.y = y

        floor[numRooms++] = this;

        drawRoom(x, y);
    }
} 

// NOTE: We want to create rooms breadth first

const roomQueue = [];

const generateRooms = async (maxRooms) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    while(numRooms < maxRooms && doorwaysRemain) {
        if(numRooms === 0) { // First Room
            let curRoom = new Room('URDL', 0, 0);
            roomQueue.push(curRoom);
            // drawStart();
        } else {
            curRoom = roomQueue.pop(); 
            if (!curRoom) {
                // Draw End Room in cases where we don't reach 10
                // const lastRoom = floor.pop();
                // drawEnd(lastRoom.x, lastRoom.y);
                doorwaysRemain = false
            }
            else {
                if (curRoom.up && !curRoom.roomUp && !roomExistsAtCoords(curRoom.x, curRoom.y - 1)) {
                    let newRoom = new Room(pickRandomRoom(roomOptions.DOWN), curRoom.x, curRoom.y - 1);
                    roomQueue.unshift(newRoom);
                    roomQueue.push(curRoom);
                    curRoom.roomUp = newRoom;
                    continue;
                } else if (curRoom.right && !curRoom.roomRight && !roomExistsAtCoords(curRoom.x + 1, curRoom.y)) {
                    let newRoom = new Room(pickRandomRoom(roomOptions.LEFT), curRoom.x + 1, curRoom.y);
                    roomQueue.unshift(newRoom);
                    roomQueue.push(curRoom);
                    curRoom.roomRight = newRoom;
                } else if (curRoom.down && !curRoom.roomDown && !roomExistsAtCoords(curRoom.x, curRoom.y + 1)) {
                    let newRoom = new Room(pickRandomRoom(roomOptions.UP), curRoom.x, curRoom.y + 1)
                    roomQueue.unshift(newRoom)
                    roomQueue.push(curRoom);
                    curRoom.roomDown = newRoom;
                } else if (curRoom.left && !curRoom.roomLeft && !roomExistsAtCoords(curRoom.x - 1, curRoom.y)) {
                    let newRoom = new Room(pickRandomRoom(roomOptions.RIGHT), curRoom.x - 1, curRoom.y);
                    roomQueue.unshift(newRoom);
                    roomQueue.push(curRoom);
                    curRoom.roomLeft = newRoom;
                } else {
                    // All doorways have a room or are blocked
                    continue;
                }
            }
        }
    }
}

const connectRooms = () => {
    // Go through rooms array and close doors
    floor.forEach((room) => {
        if(room.up && !room.roomUp) room.up = false;
        if(room.right && !room.roomRight) room.right = false;
        if(room.down && !room.roomDown) room.down = false;
        if(room.left && !room.roomLeft) room.left = false;
    });
}

// ctx.arc(center.x + (50 * end.x), center.y + (50 * end.y), 5, 0, 2 * Math.PI);

const getLocationX = (x) => {
    return center.x + (50 * x);
}

const getLocationY = (y) => {
    return center.y + (50 * y);
}

const drawDoors = () => {
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    floor.forEach((room) => {
        if (room.roomUp) {
            ctx.moveTo(getLocationX(room.x), getLocationY(room.y));
            ctx.lineTo(getLocationX(room.x), getLocationY(room.y) - 50);
        }
        if (room.roomRight) {
            ctx.moveTo(getLocationX(room.x), getLocationY(room.y));
            ctx.lineTo(getLocationX(room.x) + 50, getLocationY(room.y));
        }
        if (room.roomDown) {
            ctx.moveTo(getLocationX(room.x), getLocationY(room.y));
            ctx.lineTo(getLocationX(room.x), getLocationY(room.y) + 50);
        }
        if (room.roomLeft) {
            ctx.moveTo(getLocationX(room.x), getLocationY(room.y));
            ctx.lineTo(getLocationX(room.x) - 50, getLocationY(room.y));
        }
    });
    ctx.stroke();
}

const run = async (numRooms = 20) => {
    await generateRooms(numRooms);
    connectRooms();
    drawDoors();
    drawStart();
    drawEnd();
}

run();

$(document).on('input change', '#numRooms', () => {
    run($('#numRooms').val())
});