class Entity {
    position;
    type;

    constructor(position, type) {
        this.position = position;
        this.type = type;
    }
}

class Bullet extends Entity {
    birthTime;
    velocity;
    dead = false;

    constructor(position, birthTime, velocity) {
        super(position, Constants.ENTITY_BULLET);

        this.velocity = velocity;
        this.birthTime = birthTime;
    }
}

module.exports = {
    Entity,
    Bullet
};