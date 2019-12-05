require('./Constants.js');
let World = require('./World.js');

let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

players = {};
world = undefined;

/*
 * store everything in entity look-up table (walls, bullets, etc)
 * players in own lookup table
 *
 */

class Player {
    position;

    constructor () {
        this.position = world.getNewPlayerPosition();
    }
}

function getNewPlayerId() {
    let id;

    do {
        id = Math.floor(Math.random()*9999999);
    } while (players[id] !== undefined && players[id] !== null);

    return id;
}

function run() {
    world = new World(100, 100);

    world.addEntity(Entities.ENTITY_WALL, {x: 20, y: 20}, {orientation: Entities.ORIENTATION_VERTICAL, length: 20});
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
            players[playerId].position.set(newPosition.x, newPosition.y);
            socket.broadcast.emit('userMoved', {id: playerId, position: players[playerId].position});
        });

        socket.on('getUserList', () => socket.emit('userList', players));
        socket.on('getEntities', () => socket.emit('entities', world.entities));
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