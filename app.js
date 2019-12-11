require('./Constants.js');
let Player = require('./Player.js');
let {World, Position, Velocity} = require('./World.js');

let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {res.sendFile(__dirname + '/client/index.html');});
app.get('/draws.js', (req, res) => {res.sendFile(__dirname + '/client/draws.js');});
app.get('/collisions.js', (req, res) => {res.sendFile(__dirname + '/client/collisions.js');});
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

    world.addEntity(Constants.ENTITY_WALL, new Position(0,0), {orientation: Constants.ORIENTATION_VERTICAL, length: 20});
    world.addEntity(Constants.ENTITY_WALL, new Position(-20, 35), {orientation: Constants.ORIENTATION_HORIZONTAL, length: 40});
    world.addEntity(Constants.ENTITY_WALL, new Position(-40, 70), {orientation: Constants.ORIENTATION_HORIZONTAL, length: 40});

    let newBulletAngle = Math.floor(Math.random()*360);
    console.log(newBulletAngle);
    world.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2*Math.cos(newBulletAngle), 0.2*-Math.sin(newBulletAngle))});
    newBulletAngle = Math.floor(Math.random()*360);
    world.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2*Math.cos(newBulletAngle), 0.2*-Math.sin(newBulletAngle))});
    newBulletAngle = Math.floor(Math.random()*360);
    world.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2*Math.cos(newBulletAngle), 0.2*-Math.sin(newBulletAngle))});
    newBulletAngle = Math.floor(Math.random()*360);
    world.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2*Math.cos(newBulletAngle), 0.2*-Math.sin(newBulletAngle))});
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
                if (moveStatus === Constants.OK || moveStatus === Constants.ERR_SUCCEEDED) {
                    socket.broadcast.emit('userMoved', {
                        id: playerId,
                        position: players[playerId].position
                    });
                }
                else {
                    setTimeout(() => { //LAG 4 TESTING TODO
                    socket.emit('userMoved', {id: playerId, position: players[playerId].position});
                    }, 500*Math.random()+120); //LAG 4 TESTING TODO
                }
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
        loop();
    }, Math.floor(1000/60));
    //loop end
}

let lastTickStart;
let timeSinceLastTick;

function loop() {
    if (lastTickStart) timeSinceLastTick = new Date() - lastTickStart;
    lastTickStart = new Date();

    // console.log(timeSinceLastTick);

    world.simulate(); //TODO simulate world
    io.emit('gameState', world.getGameState()); //send game state to users
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});

run();