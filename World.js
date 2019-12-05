let Player = require('./Player.js');

class World {
    width;
    height;

    time;
    connectedPlayers = {}; //socket: id
    entities = {};

    /*
     * arguments: the world dimensions
     * half is negative, half positive
     * (so max width is half the width dimension)
     */
    constructor(width, height) {
        this.time = 0;
        this.width = width;
        this.height = height;
    }

    simulate() {
        this.time++;

        for (let entity_id in this.entities) {
            let entity = this.entities[entity_id];

            switch (entity.type) {
                case Constants.ENTITY_BULLET:
                    if (Math.abs(entity.position.x) < this.width/2 && Math.abs(entity.position.y) < this.height) entity.position.transform(entity.velocity.x, entity.velocity.y);
                    break;
                case Constants.ENTITY_WALL:
                    break;
            }
        }
    }

    addEntity(type, position, other = {}) {
        let entityId;

        do {
            entityId = Math.floor(Math.random() * 9999999);
        } while (this.entities[entityId] !== undefined && this.entities[entityId] !== null);

        if (type === Constants.ENTITY_WALL) this.entities[entityId] = {type: type, position: position, length: other.length, orientation: other.orientation};
        else this.entities[entityId] = {type: type, position: position, velocity: other.velocity};
    }

    newConnectedPlayer(socketId, playerId) {
        this.connectedPlayers[socketId] = playerId;
        players[playerId].position = new Position(Math.floor(Math.random()*this.width-this.width/2), Math.floor(Math.random()*this.height-this.height/2));
    }

    disconnectedPlayer(socketId) {
        delete this.connectedPlayers[socketId];
    }

    getGameState() {
        return {
            time: this.time,
            players: this.connectedPlayers,
            entities: this.entities
        };
    }

    getNewPlayerPosition() {
        return new Position(0, 0);
    }
}

class Position {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    transform(x = 0, y = 0) {
        this.x += x;
        this.y += y;
    }
}

class Velocity {
    x;
    y;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    transform(x = 0, y = 0) {
        this.x += x;
        this.y += y;
    }
}

Player.prototype.move = function(world, newPosition) { //TODO make move (max anyway) per second not per tick - have them move the amount allowed if they're over the max
    if (!newPosition || newPosition.x === null || newPosition.x === undefined || isNaN(newPosition.x) || newPosition.y === null || newPosition.y === undefined || isNaN(newPosition.y)) return Constants.ERR_INVALID_ARGUMENTS;

    //check move ok
    if (Math.abs(newPosition.x) > world.width / 2 || Math.abs(newPosition.y) > world.height / 2) return Constants.ERR_ILLEGAL; //check in world bounds
    if (Math.abs(newPosition.x - this.position.x) > Constants.MOVE_MAX_DISTANCE || Math.abs(newPosition.y - this.position.y) > Constants.MOVE_MAX_DISTANCE) return Constants.ERR_ILLEGAL; //check over max move allowed

    this.position = {x: newPosition.x, y: newPosition.y}; //move
    return Constants.OK; //ran successfully
};

//TODO
// Player.prototype.world = { //gets called by function in Player class
//     shoot(world) {
//         //user lerp line function from line drawing tutorial to get velocity amount
//         //TODO spawn a bullet entity or someting'
//     },
//
//
// };

module.exports = World;