require('./Constants.js');
let Player = require('./Player.js');
let World = require('./World.js');

let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {res.sendFile(__dirname + '/index.html');});
app.get('/draws.js', (req, res) => {res.sendFile(__dirname + '/draws.js');});
app.get('/Constants.js', (req, res) => {res.sendFile(__dirname + '/Constants.js');});

players = {};
world = undefined;

/*
 * store everything in entity look-up table (walls, bullets, etc)
 * players in own lookup table
 *
 */

function getNewPlayerId() {
    let id;

    do {
        id = Math.floor(Math.random()*9999999);
    } while (players[id] !== undefined && players[id] !== null);

    return id;
}

function run() {
    world = new World(100, 100);

    world.addEntity(Constants.ENTITY_WALL, {x: 20, y: 20}, {orientation: Constants.ORIENTATION_VERTICAL, length: 20});
    world.addEntity(Constants.ENTITY_WALL, {x: 40, y: 40}, {orientation: Constants.ORIENTATION_HORIZONTAL, length: 40});
    //{type: type, position: position, length: other.length, orientation: other.orientation}

    io.on('connection', function (socket) {
        console.log('connection ' + socket.id);

        let playerId = getNewPlayerId();
        players[playerId] = new Player();
        world.newConnectedPlayer(socket.id, playerId);

        console.log('user connected ' + playerId);
        socket.emit('userId', playerId);
        socket.emit('worldInfo', {width: world.width, height: world.height, time: world.time});
        io.emit('userList', players);

        socket.on('userMove', (newPosition) => {
            let moveStatus = players[playerId].move(world, newPosition);
            // players[playerId].position.set(newPosition.x, newPosition.y); the old way
            if (moveStatus === Constants.OK || moveStatus === Constants.ERR_SUCCEEDED) socket.broadcast.emit('userMoved', {id: playerId, position: players[playerId].position});
            else socket.emit('userMoved', {id: playerId, position: players[playerId].position});
        });

        socket.on('getUserList', () => socket.emit('userList', players));
        socket.on('disconnect', function () {
            io.emit('userDisconnected', playerId);
            world.disconnectedPlayer(socket.id);
            delete players[playerId]; //TODO remove later because rn new player on refresh
        });
    });

    /*
     * Game loop
     * Simulate World
     * Send Game State to Users
     */

    //loop start (TODO)
    setInterval(() => {
        world.simulate(); //TODO simulate world
        io.emit('gameState', world.getGameState()); //send game state to users
    }, 1000);
    //loop end
}

run();

http.listen(3000, function(){
    console.log('listening on *:3000');
});