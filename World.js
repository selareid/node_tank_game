class World {
    width;
    height;

    time;
    connectedPlayers = {}; //socket: id
    entities = {};

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
                case Entities.ENTITY_BULLET:
                    if (Math.abs(entity.position.x) < this.width && Math.abs(entity.position.y) < this.height) entity.position.transform(entity.velocity.x, entity.velocity.y);
                    break;
                case Entities.ENTITY_WALL:
                    break;
            }
        }
    }

    addEntity(type, position, velocity) {
        let entityId;

        do {
            entityId = Math.floor(Math.random() * 9999999);
        } while (this.entities[entityId] !== undefined && this.entities[entityId] !== null);

        this.entities[entityId] = {type: type, position: position, velocity: velocity};
    }

    newConnectedPlayer(socketId, playerId) {
        this.connectedPlayers[socketId] = playerId;
        players[playerId].position = new Position(Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height));
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

let Entities = {
    ENTITY_WALL: 'wall',
    ENTITY_BULLET: 'bullet'
};

let WorldPlayer = { //gets called by function in Player class
    ACTION_SHOOT: 'shoot',
    ACTION_MOVE: 'move',

    shoot() {
        //user lerp line function from line drawing tutorial to get velocity amount

    },

    move() {

    }
};

module.exports = World;