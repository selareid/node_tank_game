function intersects(x1, y1, x2, y2, x3, y3, x4, y4) {
    // console.log(typeof x1)
    // console.log(typeof y1)
    // console.log(typeof x2)
    // console.log(typeof y2)
    // console.log(typeof x3)
    // console.log(typeof y3)
    // console.log(typeof x4)
    // console.log(typeof y4)

    let bx = x2 - x1;
    let by = y2 - y1;
    let dx = x4 - x3;
    let dy = y4 - y3;

    let b_dot_d_perp = bx * dy - by * dx;
    if (b_dot_d_perp === 0) return false;

    let cx = x3 - x1;
    let cy = y3 - y1;

    let t = (cx * dy - cy * dx) / b_dot_d_perp;
    if (t < 0 || t > 1) return false;

    let u = (cx * by - cy * bx) / b_dot_d_perp;
    if (u < 0 || u > 1) return false;

    return true;
}

function checkCollisionBetweenWalls(wall1, wall2) {
    return wall1.position.x < wall2.position.x + (wall2.orientation === Constants.ORIENTATION_VERTICAL ? Constants.WALL_WIDTH : wall2.length) &&
        wall1.position.x + (wall1.orientation === Constants.ORIENTATION_VERTICAL ? Constants.WALL_WIDTH : wall1.length) > wall2.position.x &&
        wall1.position.y < wall2.position.y + (wall2.orientation === Constants.ORIENTATION_VERTICAL ? wall2.length : Constants.WALL_WIDTH) &&
        wall1.position.y + (wall1.orientation === Constants.ORIENTATION_VERTICAL ? wall1.length : Constants.WALL_WIDTH) > wall2.position.y;
}

/**
 *
 * @param {Position|{x: number, y:number}} lineStart
 * @param {Position|{x: number, y:number}} lineEnd
 * @param {Object} theWall
 * @returns {boolean}
 */
function checkLineAgainstWall(lineStart, lineEnd, theWall) {
    return checkLineAgainstWallVerbose(lineStart, lineEnd, theWall) !== false;
}

function checkLineAgainstWallVerbose(lineStart, lineEnd, theWall) {
    switch (theWall.orientation) {
        case Constants.ORIENTATION_HORIZONTAL:
            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                theWall.position.x, theWall.position.y, theWall.position.x + theWall.length, theWall.position.y)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    theWall.position.x, theWall.position.y + Constants.WALL_WIDTH, theWall.position.x + theWall.length, theWall.position.y + Constants.WALL_WIDTH)) {
                return Constants.COLLIDING_HORIZONTAL_SIDE;
            }

            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                theWall.position.x, theWall.position.y, theWall.position.x, theWall.position.y + Constants.WALL_WIDTH)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    theWall.position.x + theWall.length, theWall.position.y, theWall.position.x + theWall.length, theWall.position.y + Constants.WALL_WIDTH)) {
                return Constants.COLLIDING_VERTICAL_SIDE;
            }
            break;
        case Constants.ORIENTATION_VERTICAL:
            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                theWall.position.x, theWall.position.y, theWall.position.x, theWall.position.y + theWall.length)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    theWall.position.x + Constants.WALL_WIDTH, theWall.position.y, theWall.position.x + Constants.WALL_WIDTH, theWall.position.y + theWall.length)) {
                return Constants.COLLIDING_VERTICAL_SIDE;
            }

            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                theWall.position.x, theWall.position.y, theWall.position.x + Constants.WALL_WIDTH, theWall.position.y)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    theWall.position.x, theWall.position.y + theWall.length, theWall.position.x + Constants.WALL_WIDTH, theWall.position.y + theWall.length)) {
                return Constants.COLLIDING_HORIZONTAL_SIDE;
            }
            break;
    }

    return false;
}

/**
 * Checks move for collisions with entities
 * @alias checkMoveEntities
 * @param {Position} playerPosition - position of moving player
 * @param {Position} newPosition - player's new position
 * @param {Object} terrain_given
 * @returns {boolean} is it colliding
 */
function checkPlayerMoveTerrain(playerPosition, newPosition, terrain_given) {
    let x = newPosition.x - playerPosition.x;
    let y = newPosition.y - playerPosition.y;

    for (let terrainId in terrain_given) {
        let terrain = terrain_given[terrainId];
        if (terrain.type === Constants.TERRAIN_WALL) {
            //the wall .position is the top-left corner

            /* one line is the movement line
             * where points 1 & 2 are the original position
             * points 3 & 4 are the move to position
             * Other line is edge of wall
             */

            for (let pos of [
                {
                    x: playerPosition.x - Constants.PLAYER_SIZE / 2,
                    y: playerPosition.y - Constants.PLAYER_SIZE / 2
                },
                {
                    x: playerPosition.x - Constants.PLAYER_SIZE / 2,
                    y: playerPosition.y + Constants.PLAYER_SIZE / 2
                },
                {
                    x: playerPosition.x + Constants.PLAYER_SIZE / 2,
                    y: playerPosition.y - Constants.PLAYER_SIZE / 2
                },
                {
                    x: playerPosition.x + Constants.PLAYER_SIZE / 2,
                    y: playerPosition.y + Constants.PLAYER_SIZE / 2
                }
            ]) {
                if (checkLineAgainstWall(pos, {x: pos.x + x, y: pos.y + y}, terrain)) return true;
            }
        }
    }

    return false;
}

/**
 *
 * @param {Bullet} bulletEntity - the bullet being checked
 * @param terrain - world terrain
 * @param {number} worldWidth - width of the world
 * @param {number} worldHeight - height of the world
 * @returns {boolean} - any collision found?
 */
function handleBulletWallCollision(bulletEntity, terrain, worldWidth, worldHeight) {
    for (let terrainId in terrain) {
        let entity = terrain[terrainId]; //TODO rename from entity to terrain variable, cant be bothered rn, totally gonna do it later - 14-12-2019
        if (entity.type === Constants.TERRAIN_WALL) {
            /* TODO - it doesn't take into account the bullet's size
            */
            let relativeX = Math.abs(((entity.position.x+worldWidth) + (entity.orientation === Constants.ORIENTATION_VERTICAL ? Constants.WALL_WIDTH : entity.length)/2) - (bulletEntity.position.x+worldWidth))
                / ((entity.orientation === Constants.ORIENTATION_VERTICAL ? Constants.WALL_WIDTH : entity.length)/2); // 0 - 1

            let relativeY = Math.abs(((entity.position.y+worldHeight) + (entity.orientation === Constants.ORIENTATION_HORIZONTAL ? Constants.WALL_WIDTH : entity.length)/2) - (bulletEntity.position.y+worldHeight))
                / ((entity.orientation === Constants.ORIENTATION_HORIZONTAL ? Constants.WALL_WIDTH : entity.length)/2); // 0 - 1

            if (relativeX > 0 && relativeX < 1 && relativeY > 0 && relativeY < 1) { //colliding
                if (relativeX-relativeY === 0) { //perfect corner
                    bulletEntity.velocity.x = -bulletEntity.velocity.x;
                    bulletEntity.velocity.y = -bulletEntity.velocity.y;
                }

                if (relativeX > relativeY) bulletEntity.velocity.x = -bulletEntity.velocity.x;
                else bulletEntity.velocity.y = -bulletEntity.velocity.y;

                return true;
            }
        }
    }

    return false;
}

module.exports = {
    checkMoveTerrain: checkPlayerMoveTerrain,
    handleBulletWallCollision,
    checkLineAgainstWall,
    checkCollisionBetweenWalls
};