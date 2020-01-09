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
            theWorld = new World(250, 250);

            for (let i = 0; i< 7; i++) {
                theWorld.addTerrain(Constants.TERRAIN_WALL,
                    new Position(Math.floor(Math.random() * theWorld.width - theWorld.width / 2), Math.floor(Math.random() * theWorld.height - theWorld.height / 2)), {
                        orientation: Math.floor(Math.random() * 2) >= 1 ? Constants.ORIENTATION_VERTICAL : Constants.ORIENTATION_HORIZONTAL,
                        length: Math.max(Math.floor(Math.random() * 50) + 5, Constants.WALL_WIDTH)
                    });
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

        getActivePlayer: function() {
            let toReturn = {};

            for (let socketId in theWorld.connectedPlayers) {
                let playerId = theWorld.connectedPlayers[socketId];

                toReturn[playerId] = thePlayers[playerId];
            }

            return toReturn;
        },

        getPlayers: function() {
            return thePlayers;
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