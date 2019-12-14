class Terrain {
    position;
    type;

    constructor(position, type) {
        this.position = position;
        this.type = type;
    }
}

class Wall extends Terrain {
    length;
    orientation;

    constructor(position, orientation, length) {
        super(position, Constants.TERRAIN_WALL);

        this.length = length;
        this.orientation = orientation;
    }
}

module.exports = {
    Terrain,
    Wall
};