class Player {
    position;

    constructor () {
        this.position = world.getNewPlayerPosition();
    }
}

module.exports = Player;