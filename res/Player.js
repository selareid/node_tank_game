const collisions = require('./collisions.js');
const socketHandling = require('./socket.js');
const {World, Position, Velocity} = require('./World.js');

class Player {
    id;
    position;
    dead = false;
    deathTick;
    ammo = 0;
    lastShot = 0;
    inventory = [];
    selectedHotBar = 0;

    constructor(id) {
        this.id = id;
        this.position = require('./Saves.js').World.getNewPlayerPosition();
        this.ammo = Constants.PLAYER_MAX_AMMO;
        for (let i = 0; i < Constants.INVENTORY_SLOTS; i++) this.inventory[i] = null;
    }

    alive() {
        return this.dead === true;
    }

    die() {
        this.dead = true;
        this.deathTick = require('./Saves.js').World.time;
        socketHandling.pushDeath(this.id);
    }
}

Player.prototype.move = function(world, newPosition) { //TODO make move (max anyway) per second not per tick - have them move the amount allowed if they're over the max
    if (!newPosition || newPosition.x === null || newPosition.x === undefined || isNaN(newPosition.x) || newPosition.y === null || newPosition.y === undefined || isNaN(newPosition.y)) return Constants.ERR_INVALID_ARGUMENTS;

    //check move ok
    if (Math.abs(newPosition.x) + Constants.PLAYER_SIZE / 2 > world.width / 2 || Math.abs(newPosition.y) + Constants.PLAYER_SIZE / 2 > world.height / 2) return Constants.ERR_ILLEGAL; //check in world bounds
    if (Math.abs(newPosition.x - this.position.x) > Constants.MOVE_MAX_DISTANCE || Math.abs(newPosition.y - this.position.y) > Constants.MOVE_MAX_DISTANCE) return Constants.ERR_ILLEGAL; //check over max move allowed

    if (collisions.checkMoveTerrain(this.position, newPosition, world.terrain)) return Constants.ERR_ILLEGAL;

    this.position = {x: newPosition.x, y: newPosition.y}; //move
    return Constants.OK; //ran successfully
};

Player.prototype.useItem = {
    [Constants.ITEM_WALL]: function (positionToPlace) {
        let placeStatus = require('./Saves.js').World.addTerrain(Constants.TERRAIN_WALL, positionToPlace, {
            orientation: Constants.ORIENTATION_HORIZONTAL,
            length: Constants.WALL_WIDTH
        });

        //TODO if placing wall fails send original terrain to player placing (for later when I add client side checks that place on their end before server updates)
        //TODO add client side checks
    }
};

module.exports = {Player};