let ioT;

function io(io) {
    ioT = io;

    //putting these at the top causes an error for some reason because World.js requires this file
    const Saves = require('./Saves.js');

    io.on('connection', function (socket) {
        console.log('connection ' + socket.id);

        socket.emit('pleaseAuth');

        socket.on('authing', function (authCode) {
            let playerId;

            if (authCode === -1 || !Saves.Players.checkPlayerExists(authCode)) playerId = Saves.Players.newPlayer();
            else if (Saves.Players.getActivePlayers()[authCode]) {
                socket.emit('authFailedMateUCanNoHackaMeYa');
                return;
            }
            else playerId = authCode;

            Saves.World.newConnectedPlayer(socket.id, playerId);

            console.log('user connected ' + playerId);
            socket.emit('userId', playerId);
            socket.emit('worldInfo', {
                width: Saves.World.width,
                height: Saves.World.height,
                time: Saves.World.time,
                terrain: Saves.World.terrain
            });
            socket.broadcast.emit('newPlayer', Saves.Players.getPlayerStripped(playerId));

            socket.on('selectedHotBarChange', function (newSelectedHotBarSlot) { //TODO maybe bad because people scroll lots
                Saves.Players.getPlayer(playerId).selectedHotBar = newSelectedHotBarSlot; //TODO maybe propagate to all the world (other players)
            });

            socket.on('userMove', (newPosition) => {
                let moveStatus = Saves.Players.getPlayer(playerId).move(Saves.World, newPosition);
                // players[playerId].position.set(newPosition.x, newPosition.y); the old way
                if (moveStatus === Constants.OK || moveStatus === Constants.ERR_SUCCEEDED) {
                    socket.broadcast.emit('userMoved', {
                        id: playerId,
                        position: Saves.Players.getPlayer(playerId).position
                    });
                } else {
                    setTimeout(() => { //LAG 4 TESTING TODO
                        socket.emit('userMoved', {id: playerId, position: Saves.Players.getPlayer(playerId).position});
                    }, 500 * Math.random() + 120); //LAG 4 TESTING TODO
                }
            });

            //use items
            socket.on(`userItem-${Constants.ITEM_WALL}`, (positionGiven) => Saves.Players.getPlayer(playerId).useItem[Constants.ITEM_WALL](positionGiven));

            // socket.on('userShoot', () => {
            //     players[playerId].shoot(Saves.World);
            // });

            socket.on('getUserList', () => socket.emit('userList', Saves.Players.getActivePlayersStripped(playerId)));

            socket.on('disconnect', function () {
                io.emit('userDisconnected', playerId);
                Saves.World.disconnectedPlayer(socket.id);
                //delete Saves.Players.removePlayer(playerId); //TODO remove later because rn new player on refresh
            });

            socket.on('getTerrain', function () {
                socket.emit('terrain', Saves.World.terrain);
            });

        });
    });
}

function pushDeath(playerId) {
    ioT.emit('playerDied', playerId);
}

module.exports = {
    io,
    pushDeath
};