const Saves = require('./Saves.js');
let Player = require('./Player.js');

function getNewPlayerId() {
    let id;

    do {
        id = Math.floor(Math.random()*9999999);
    } while (players[id] !== undefined && players[id] !== null);

    return id;
}

module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log('connection ' + socket.id);

        let playerId = getNewPlayerId();
        players[playerId] = new Player();
        Saves.World.newConnectedPlayer(socket.id, playerId);

        console.log('user connected ' + playerId);
        socket.emit('userId', playerId);
        socket.emit('worldInfo', {width: Saves.World.width, height: Saves.World.height, time: Saves.World.time});
        io.emit('userList', players);

        socket.on('userMove', (newPosition) => {
            let moveStatus = players[playerId].move(Saves.World, newPosition);
            // players[playerId].position.set(newPosition.x, newPosition.y); the old way
            if (moveStatus === Constants.OK || moveStatus === Constants.ERR_SUCCEEDED) {
                socket.broadcast.emit('userMoved', {
                    id: playerId,
                    position: players[playerId].position
                });
            } else {
                setTimeout(() => { //LAG 4 TESTING TODO
                    socket.emit('userMoved', {id: playerId, position: players[playerId].position});
                }, 500 * Math.random() + 120); //LAG 4 TESTING TODO
            }
        });

        socket.on('getUserList', () => socket.emit('userList', players));
        socket.on('disconnect', function () {
            io.emit('userDisconnected', playerId);
            Saves.World.disconnectedPlayer(socket.id);
            delete players[playerId]; //TODO remove later because rn new player on refresh
        });
    });
}