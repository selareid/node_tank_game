let {World, Position, Velocity} = require('./World.js');

let theWorld;

const Saves = {
    get World() {
        if (!theWorld) { //TODO have actual saving lol
            theWorld = new World(1000, 1000);

            for (let i = 0; i< 1000; i++) {
                theWorld.addTerrain(Constants.TERRAIN_WALL,
                    new Position(Math.floor(Math.random() * theWorld.width - theWorld.width / 2), Math.floor(Math.random() * theWorld.height - theWorld.height / 2)), {
                        orientation: Math.floor(Math.random() * 2) >= 1 ? Constants.ORIENTATION_VERTICAL : Constants.ORIENTATION_HORIZONTAL,
                        length: Math.max(Math.floor(Math.random() * 50) + 5, Constants.WALL_WIDTH)
                    });
            }

            let newBulletAngle;
            for (let i = 0; i < 100; i++) {
                newBulletAngle = Math.floor(Math.random() * 360);
                theWorld.addEntity(Constants.ENTITY_BULLET, new Position(Math.floor(Math.random()*30)-15, Math.floor(Math.random()*30)-15), {velocity: new Velocity(0.2 * Math.cos(newBulletAngle), 0.2 * -Math.sin(newBulletAngle))});
            }
        }

        return theWorld;
    },

    set World(newWorld) {
        theWorld = newWorld;
    }
};

module.exports = Saves;