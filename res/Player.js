const collisions = require('./collisions.js');
const socketHandling = require('./socket.js');
const {World, Position, Velocity} = require('./World.js');

class InventoryItem {
    id;
    amount;

    constructor(id, amount) {
        this.id = id;
        this.amount = amount;
    }
}

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

        this.inventory[1] = new InventoryItem(Constants.ITEM_WALL, 5); //TODO FREE ITEMS (REMOVE THIS)
        //this.inventory[2] = new InventoryItem(Constants.ITEM_DIRT, Number.POSITIVE_INFINITY); //TODO FREE ITEMS (REMOVE THIS)
        //this.inventory[3] = new InventoryItem(Constants.ITEM_PICKAXE, Number.POSITIVE_INFINITY); //TODO FREE ITEMS (REMOVE THIS)
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

Player.prototype.checkUsageAllowed = function (itemId) {
    return this.inventory[this.selectedHotBar] && this.inventory[this.selectedHotBar].id === itemId && this.inventory[this.selectedHotBar].amount > 0;
};

Player.prototype.useItemUniversals = function () {
    this.inventory[this.selectedHotBar].amount -= 1;

    if (this.inventory[this.selectedHotBar].amount < 1) this.inventory[this.selectedHotBar] = null;
};

Player.prototype[`useItem${Constants.ITEM_WALL}`] = function (positionToPlace) {
    if (!this.checkUsageAllowed(Constants.ITEM_WALL)) return Constants.ERR_ILLEGAL;

    let placeStatus = require('./Saves.js').World.addTerrain(Constants.TERRAIN_WALL, positionToPlace, {
        orientation: Constants.ORIENTATION_HORIZONTAL,
        length: Constants.WALL_WIDTH
    });

    //TODO if placing wall fails send original terrain to player placing (for later when I add client side checks that place on their end before server updates)
    //TODO add client side checks

    this.useItemUniversals();
    return placeStatus;
};

module.exports = {Player};
