const Saves = require('./Saves.js');
const collisions = require('./collisions.js');

class Player {
    position;
    dead = false;

    constructor() {
        this.position = Saves.World.getNewPlayerPosition();
    }

    alive() {
        return this.dead === true;
    }

    die() {
        this.dead = true;
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

//TODO
// Player.prototype.world = { //gets called by function in Player class
//     shoot(world) {
//         //user lerp line function from line drawing tutorial to get velocity amount
//         //TODO spawn a bullet entity or someting'
//     },
//
//
// };

module.exports = Player;