require('./Constants.js');
const Saves = require('./Saves.js');
const socketHandlinga = require('./socket.js');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {res.sendFile(__dirname + '/client/index.html');});
app.get('/draws.js', (req, res) => {res.sendFile(__dirname + '/client/draws.js');});
app.get('/collisions.js', (req, res) => {res.sendFile(__dirname + '/client/collisions.js');});
app.get('/Constants.js', (req, res) => {res.sendFile(__dirname + '/Constants.js');});

players = {};

/*
 * store everything in entity look-up table (walls, bullets, etc)
 * players in own lookup table
 *
 */

function run() {
    /*console.log(*/Saves.World;//);
    //TODO remove or move to Saves.js {type: type, position: position, length: other.length, orientation: other.orientation}

   socketHandlinga.io(io); //enable to socket.io things

    /*
     * Game loop
     * Simulate World
     * Send Game State to Users
     */

    //loop start (TODO)
    setInterval(() => {
        loop();
    }, Math.floor(1000/60));
    //loop end
}

let lastTickStart;
timeSinceLastTick = 0;

function loop() {
    if (lastTickStart) timeSinceLastTick = new Date() - lastTickStart;
    lastTickStart = new Date();

    // console.log(timeSinceLastTick);

    Saves.World.simulate(); //TODO simulate world
    io.emit('gameState', Saves.World.getGameState()); //send game state to users
    Saves.World.pushTerrain = false;
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});

run();