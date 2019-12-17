let {World, Position, Velocity} = require('./World.js');

let theWorld;

const Saves = {
    get World() {
        if (!theWorld) { //TODO have actual saving lol
            theWorld = new World(1000, 1000);

            for (let i = 0; i< 100; i++) {
                theWorld.addTerrain(Constants.TERRAIN_WALL,
                    new Position(Math.floor(Math.random() * theWorld.width - theWorld.width / 2), Math.floor(Math.random() * theWorld.height - theWorld.height / 2)), {
                        orientation: Math.floor(Math.random() * 2) >= 1 ? Constants.ORIENTATION_VERTICAL : Constants.ORIENTATION_HORIZONTAL,
                        length: Math.max(Math.floor(Math.random() * 50) + 5, Constants.WALL_WIDTH)
                    });
            }

            // let newBulletAngle;
            // for (let i = 0; i < 100; i++) {
            //     newBulletAngle = Math.floor(Math.random() * 360);
            //     let id = theWorld.addEntity(Constants.ENTITY_BULLET, new Position(Math.floor(Math.random() * theWorld.width - theWorld.width / 2), Math.floor(Math.random() * theWorld.height - theWorld.height / 2)),
            //         {velocity: new Velocity(Constants.BULLET_SPEED * Math.cos(newBulletAngle), Constants.BULLET_SPEED * -Math.sin(newBulletAngle))});
            //     theWorld.entities[id].lifeCountdown += Math.floor(Math.random()*10000-5000);
            // }
        }

        return theWorld;
    },

    set World(newWorld) {
        theWorld = newWorld;
    }
};

module.exports = Saves;