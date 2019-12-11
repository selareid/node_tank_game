class Entity {
    position;
    type;

    constructor(position, type) {
        this.position = position;
        this.type = type;
    }
}

class Wall extends Entity {
    length;
    orientation;

    constructor(position, orientation, length) {
        super(position, Constants.ENTITY_WALL);

        this.length = length;
        this.orientation = orientation;
    }
}

class Bullet extends Entity {
    birthTime;
    velocity;
    dead = false;

    constructor(position, velocity) {
        super(position, Constants.ENTITY_BULLET);

        this.velocity = velocity;
        this.birthTime = world.time;
    }
}

module.exports = {
    Entity,
    Wall,
    Bullet
};