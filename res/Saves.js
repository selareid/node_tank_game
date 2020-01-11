const {Player} = require('./Player.js');
const {World, Position, Velocity} = require('./World.js');

let theWorld;
let thePlayers = {};

function getNewPlayerId() {
    let id;

    do {
        id = Math.floor(Math.random()*9999999);
    } while (Saves.Players.checkPlayerExists(id));

    return id;
}

const Saves = {
    get World() {
        if (!theWorld) { //TODO have actual saving lol
            theWorld = new World(150, 150);

            for (let i = 0; i< 13; i++) {
                let wallStatus = theWorld.addTerrain(Constants.TERRAIN_WALL,
                    new Position(Math.floor(Math.random() * theWorld.width - theWorld.width / 2), Math.floor(Math.random() * theWorld.height - theWorld.height / 2)), {
                        orientation: Math.floor(Math.random() * 2) >= 1 ? Constants.ORIENTATION_VERTICAL : Constants.ORIENTATION_HORIZONTAL,
                        length: Math.max(Math.floor(Math.random() * 50) + 5, Constants.WALL_WIDTH)
                    });

                if (wallStatus === Constants.ERR_ILLEGAL) console.log('failed to make wall ' + i);
            }


            // let newBulletAngle;
            // for (let i = 0; i < 100; i++) {
            //     newBulletAngle = Math.floor(Math.random() * 360);
            //     let id = theWorld.addEntity(Constants.ENTITY_BULLET, new Position(Math.floor(Math.random() * theWorld.width - theWorld.width / 2), Math.floor(Math.random() * theWorld.height - theWorld.height / 2)),
            //         {velocity: new Velocity(Constants.BULLET_SPEED * Math.cos(newBulletAngle), Constants.BULLET_SPEED * -Math.sin(newBulletAngle))});
            //     theWorld.entities[id].lifeCountdown += Math.floor(Math.random()*10000-5000);
            // }
        }

        return theWorld;
    },

    set World(newWorld) {
        theWorld = newWorld;
    },

    Players: {
        checkPlayerExists: function(userId) {
            return thePlayers[userId] !== null && thePlayers[userId] !== undefined;
        },

        getActivePlayersStripped: function(playerToIgnore) {
            return this.getActivePlayers(true, playerToIgnore);
        },

        /**
         * getActivePlayers
         * @param {boolean} stripped - whether or not to strip the active player data
         * @param userToUnStrip - user to ignore when stripping
         * @returns {{}}
         */
        getActivePlayers: function(stripped = false, userToUnStrip) {
            let toReturn = {};

            for (let socketId in theWorld.connectedPlayers) {
                let playerId = theWorld.connectedPlayers[socketId];

                if (stripped && userToUnStrip !== playerId) {
                    toReturn[playerId] = this.getPlayerStripped(playerId);
                }
                else toReturn[playerId] = thePlayers[playerId];
            }

            return toReturn;
        },

        getPlayers: function() {
            return thePlayers;
        },

        getPlayerStripped: function(userId) {
            return { //stripped down version of player
                id: thePlayers[userId].id,
                position: thePlayers[userId].position,
                dead: thePlayers[userId].dead,
                selectedHotBarItem: thePlayers[userId].inventory[thePlayers[userId].selectedHotBar]
            };
        },

        getPlayer: function(userId) {
            if (!thePlayers[userId]) console.log(`RIP, tried to get user ${userId} but they don't exist lol`);

            return thePlayers[userId];
        },

        newPlayer: function () {
            let newPlayerId = getNewPlayerId();

            thePlayers[newPlayerId] = new Player(newPlayerId);

            return newPlayerId;
        },

        removePlayer: function (userId) {
            delete thePlayers[userId];
        }
    }
};

module.exports = Saves;