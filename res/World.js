const collisions = require('./collisions.js');
const {Entity, Bullet} = require('./Entity.js');
const {Terrain, Wall} = require('./Terrain.js');

class World {
    width;
    height;

    time;
    connectedPlayers = {}; //socket: id
    terrain = {};
    entities = {};

    pushTerrain = false;

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

                    //check life time
                    entity.lifeCountdown -= timeSinceLastTick;
                    if (entity.lifeCountdown < 0) entity.dead = true;

                    if (Math.abs(entity.position.x + entity.velocity.x) + Constants.BULLET_SIZE > this.width / 2
                    ) entity.velocity.x = -entity.velocity.x; //reverse horizontal velocity (bounce)
                    if (Math.abs(entity.position.y + entity.velocity.y) + Constants.BULLET_SIZE > this.height / 2 //bottom
                    ) entity.velocity.y = -entity.velocity.y; //bounce

                    //check walls
                    collisions.handleBulletWallCollision(entity, this.terrain, this.width, this.height);

                    if (!entity.dead) {
                        //check players
                        for (let playerId in require('./Saves.js').Players.getPlayers()) {
                            let player = require('./Saves.js').Players.getPlayer(playerId);
                            if (player.alive()) continue;

                            if (Math.abs(player.position.x - entity.position.x) < (Constants.BULLET_SIZE + Constants.PLAYER_SIZE) / 2
                                && Math.abs(player.position.y - entity.position.y) < (Constants.BULLET_SIZE + Constants.PLAYER_SIZE) / 2) {
                                player.die();
                                entity.dead = true;
                            }
                        }
                    }

                    entity.position.transform(entity.velocity.x, entity.velocity.y);

                    if (entity.dead) delete this.entities[entity_id];

                    break;
            }
        }
    }

    /**
     *
     * @param {string} type
     * @param {Position|{x: number, y: number}} position
     * @param {Object} [options={}]
     */
    addTerrain(type, position, options = {}) {
        let terrainId;

        do {
            terrainId = Math.floor(Math.random() * 9999999);
        } while (this.terrain[terrainId] !== undefined && this.terrain[terrainId] !== null);

        switch (type) {
            case Constants.TERRAIN_WALL:
                if (options.length < Constants.WALL_WIDTH) throw Constants.ERR_INVALID_ARGUMENTS;

                this.terrain[terrainId] = new Wall(position, options.orientation, options.length);
                break;
            default:
                throw Constants.ERR_INVALID_ARGUMENTS;
        }

        this.pushTerrain = true;

        return terrainId;
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

        switch (type) {
            case Constants.ENTITY_BULLET:
                this.entities[entityId] = new Bullet(position, this.time, options.velocity);
                break;
            default:
                throw Constants.ERR_INVALID_ARGUMENTS;
        }

        return entityId;
    }

    newConnectedPlayer(socketId, playerId) {
        this.connectedPlayers[socketId] = playerId;
        require('./Saves.js').Players.getPlayer(playerId).position = this.getNewPlayerPosition();
    }

    disconnectedPlayer(socketId) {
        delete this.connectedPlayers[socketId];
    }

    getGameState() {
        return {
            time: this.time,
            players: this.connectedPlayers,
            entities: this.entities,
            terrain: this.pushTerrain ? this.terrain : null
        };
    }

    getNewPlayerPosition() {
        return new Position(Math.floor(Math.random()*Constants.SPAWN_AREA_SIZE)-Constants.SPAWN_AREA_SIZE, Math.floor(Math.random()*Constants.SPAWN_AREA_SIZE)-Constants.SPAWN_AREA_SIZE);
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