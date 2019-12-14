class Entity {
    birthTime;
    position;
    type;
    velocity;
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

module.exports = {
    Entity,
    Bullet
};