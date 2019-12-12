let {World, Position, Velocity} = require('./World.js');

let theWorld;

const Saves = {
    get World() {
        if (!theWorld) { //TODO have actual saving lol
            theWorld = new World(100, 100);

            theWorld.addEntity(Constants.ENTITY_WALL, new Position(0, 0), {
                orientation: Constants.ORIENTATION_VERTICAL,
                length: 20
            });
            theWorld.addEntity(Constants.ENTITY_WALL, new Position(-20, 35), {
                orientation: Constants.ORIENTATION_HORIZONTAL,
                length: 40
            });
            theWorld.addEntity(Constants.ENTITY_WALL, new Position(-40, 70), {
                orientation: Constants.ORIENTATION_HORIZONTAL,
                length: 40
            });

            let newBulletAngle = Math.floor(Math.random() * 360);
            theWorld.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2 * Math.cos(newBulletAngle), 0.2 * -Math.sin(newBulletAngle))});
            newBulletAngle = Math.floor(Math.random() * 360);
            theWorld.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2 * Math.cos(newBulletAngle), 0.2 * -Math.sin(newBulletAngle))});
            newBulletAngle = Math.floor(Math.random() * 360);
            theWorld.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2 * Math.cos(newBulletAngle), 0.2 * -Math.sin(newBulletAngle))});
            newBulletAngle = Math.floor(Math.random() * 360);
            theWorld.addEntity(Constants.ENTITY_BULLET, new Position(-3, -25), {velocity: new Velocity(0.2 * Math.cos(newBulletAngle), 0.2 * -Math.sin(newBulletAngle))});
        }

        return theWorld;
    },

    set World(newWorld) {
        theWorld = newWorld;
    }
};

module.exports = Saves;