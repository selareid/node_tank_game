const Saves = require('./Saves.js');
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
    hotBar = [];
    selectedHotBar = 0;

    constructor(id) {
        this.id = id;
        this.position = Saves.World.getNewPlayerPosition();
        this.ammo = Constants.PLAYER_MAX_AMMO;
        for (let i = 0; i < Constants.HOT_BAR_SLOTS; i++) this.hotBar[i] = null;
    }

    alive() {
        return this.dead === true;
    }

    die() {
        this.dead = true;
        this.deathTick = Saves.World.time;
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

// Player.prototype.shoot = function(world) {
//     if (this.lastShot === world.time) return Constants.ERR_TOO_FAST;
//
//     this.ammo += this.ammo >= Constants.PLAYER_MAX_AMMO ? 0 : (timeSinceLastTick * (world.time - this.lastShot)) / 500;
//
//     if (this.ammo < 1) return Constants.ERR_ILLEGAL;
//     if (timeSinceLastTick * (world.time - this.lastShot) < 1000/Constants.PLAYER_SHOOT_SPEED) return Constants.ERR_ILLEGAL;
//
//     world.addEntity(Constants.ENTITY_BULLET, new Position (this.position.x, this.position.y-Constants.PLAYER_SIZE-Constants.BULLET_SIZE/2),
//         {velocity: new Velocity(0, -Constants.BULLET_SPEED)});
//     this.ammo--;
//     this.lastShot = world.time;
//
//     return Constants.OK;
// };

module.exports = Player;