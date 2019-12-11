const collisions = require('./collisions.js');

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
                    //horizontal world edges check
                    if (Math.abs(entity.position.x + entity.velocity.x) + Constants.BULLET_SIZE > this.width/2
                    ) entity.velocity.x = -entity.velocity.x; //reverse horizontal velocity (bounce)
                    if(Math.abs(entity.position.y + entity.velocity.y) + Constants.BULLET_SIZE > this.height/2 //bottom
                    ) entity.velocity.y = -entity.velocity.y; //bounce

                    //check walls
                    collisions.handleBulletWallCollision(entity, this.entities);

                    //check players
                    for (let playerId in players) {
                        let player = players[playerId];
                        if (Math.abs(player.position.x-entity.position.x) < (Constants.BULLET_SIZE+Constants.PLAYER_SIZE)/2
                            && Math.abs(player.position.y-entity.position.y) < (Constants.BULLET_SIZE+Constants.PLAYER_SIZE)/2) {
                            //TODO also kill the player, have dead variable that gets checked at end of the entity's run loop
                            delete this.entities[entity_id];
                        }
                    }

                    entity.position.transform(entity.velocity.x, entity.velocity.y);
                    break;
                // walls are pretty static
                // case Constants.ENTITY_WALL:
                //     break;
            }
        }
    }

    /**
     *
     * @param {string} type
     * @param {Position|{x: number, y: number}} position
     * @param {Object} [options={}]
     */
    addEntity(type, position, options = {}) {
        let entityId;

        do {
            entityId = Math.floor(Math.random() * 9999999);
        } while (this.entities[entityId] !== undefined && this.entities[entityId] !== null);

        if (type === Constants.ENTITY_WALL) this.entities[entityId] = {type: type, position: position, length: options.length, orientation: options.orientation};
        else {
            this.entities[entityId] = {type: type, position: position, birthTime: world.time, velocity: options.velocity};
        }
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

module.exports = {World, Position, Velocity};