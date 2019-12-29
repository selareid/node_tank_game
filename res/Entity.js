class Entity {
    birthTime;
    position;
    velocity;
    type;
    dead = false;

    constructor(position, type, birthTime, velocity) {
        this.position = position;
        this.type = type;
        this.birthTime = birthTime;
        this.velocity = velocity;
    }
}

class Bullet extends Entity {
    lifeCountdown; //in milliseconds

    constructor(position, birthTime, velocity) {
        super(position, Constants.ENTITY_BULLET, birthTime, velocity);

        this.lifeCountdown = Constants.BULLET_LIFETIME;
    }
}

// class Vehicle extends Entity {
//     pilotUser;
//
//     constructor(position, birthTime, velocity) {
//         super(position, Constants.ENTITY_VEHICLE_CAR, birthTime, velocity);
//     }
//
//     userEnter(playerId) {
//         if (playerId === null || playerId === undefined) return Constants.ERR_INVALID_ARGUMENTS;
//         if (this.pilotUser !== null && this.pilotUser !== undefined && this.pilotUser !== playerId) return Constants.ERR_ILLEGAL;
//
//         this.pilotUser = playerId;
//         return Constants.OK;
//     }
//
//     userExit(playerId) {
//         if (playerId === null || playerId === undefined) return Constants.ERR_INVALID_ARGUMENTS;
//         if (this.pilotUser !== playerId) return Constants.ERR_ILLEGAL;
//
//         this.pilotUser = null;
//         return Constants.OK;
//     }
//
//     run(world) {
//         this.position.transform(this.velocity.x, this.velocity.y);
//     }
//
//     /**
//      *
//      * @param {World} world
//      * @param {{x: number, y: number}} xyChange
//      */
//     move(world, xyChange) {
//         //TODO do checks and change velocity
//     }
// }
//
// class Car extends Vehicle {
//     rotation;
//
//     constructor(position, birthTime, velocity, rotation) {
//         super(position, birthTime, velocity);
//
//         this.rotation = rotation;
//     }
//
//     /**
//      *
//      * @param {World} world
//      * @param {number} moveAmount
//      */
//     move(world, moveAmount) {
//         let xyChange = {x, y};
//
//         /*
//         TODO GET THE VELOCITY FROM THE MOVEAMOUNT AND ROTATION
//         xyChange.x = MATH N CRAP * moveAmount;
//         xyChange.y = MATH N CRAP * moveAmount;
//          */
//
//         super.move(world, xyChange);
//     }
// }

module.exports = {
    Entity,
    Bullet
};