let ioT;

function io(io) {
    ioT = io;

    //putting these at the top causes an error for some reason because World.js requires this file
    const Saves = require('./Saves.js');

    io.on('connection', function (socket) {
        console.log('connection ' + socket.id);

        let playerId = Saves.Players.newPlayer();
        Saves.World.newConnectedPlayer(socket.id, playerId);

        console.log('user connected ' + playerId);
        socket.emit('userId', playerId);
        socket.emit('worldInfo', {width: Saves.World.width, height: Saves.World.height, time: Saves.World.time, terrain: Saves.World.terrain});
        io.emit('userList', Saves.Players.getActivePlayer());

        socket.on('userMove', (newPosition) => {
            let moveStatus = Saves.Players.getPlayer(playerId).move(Saves.World, newPosition);
            // players[playerId].position.set(newPosition.x, newPosition.y); the old way
            if (moveStatus === Constants.OK || moveStatus === Constants.ERR_SUCCEEDED) {
                socket.broadcast.emit('userMoved', {id: playerId, position: Saves.Players.getPlayer(playerId).position});
            } else {
                setTimeout(() => { //LAG 4 TESTING TODO
                    socket.emit('userMoved', {id: playerId, position: Saves.Players.getPlayer(playerId).position});
                }, 500 * Math.random() + 120); //LAG 4 TESTING TODO
            }
        });

        // socket.on('userShoot', () => {
        //     players[playerId].shoot(Saves.World);
        // });

        socket.on('getUserList', () => socket.emit('userList', Saves.Players.getActivePlayer()));
        socket.on('disconnect', function () {
            io.emit('userDisconnected', playerId);
            Saves.World.disconnectedPlayer(socket.id);
            //delete Saves.Players.removePlayer(playerId); //TODO remove later because rn new player on refresh
        });

        socket.on('getTerrain', function () {
            socket.emit('terrain', Saves.World.terrain);
        })
    });
}

function pushDeath(playerId) {
    ioT.emit('playerDied', playerId);
}

module.exports = {
    io,
    pushDeath
};