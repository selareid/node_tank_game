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

/**
 *
 * @param {Position|{x: number, y:number}} lineStart
 * @param {Position|{x: number, y:number}} lineEnd
 * @param {Object} entity
 * @returns {boolean}
 */
function checkLineAgainstWall(lineStart, lineEnd, entity) {
    return checkLineAgainstWallVerbose(lineStart, lineEnd, entity) !== false;
}

function checkLineAgainstWallVerbose(lineStart, lineEnd, entity) {
    switch (entity.orientation) {
        case Constants.ORIENTATION_HORIZONTAL:
            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                entity.position.x, entity.position.y, entity.position.x + entity.length, entity.position.y)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    entity.position.x, entity.position.y + Constants.WALL_WIDTH, entity.position.x + entity.length, entity.position.y + Constants.WALL_WIDTH)) {
                return Constants.COLLIDING_HORIZONTAL_SIDE;
            }

            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                entity.position.x, entity.position.y, entity.position.x, entity.position.y + Constants.WALL_WIDTH)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    entity.position.x + entity.length, entity.position.y, entity.position.x + entity.length, entity.position.y + Constants.WALL_WIDTH)) {
                return Constants.COLLIDING_VERTICAL_SIDE;
            }
            break;
        case Constants.ORIENTATION_VERTICAL:
            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                entity.position.x, entity.position.y, entity.position.x, entity.position.y + entity.length)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    entity.position.x + Constants.WALL_WIDTH, entity.position.y, entity.position.x + Constants.WALL_WIDTH, entity.position.y + entity.length)) {
                return Constants.COLLIDING_VERTICAL_SIDE;
            }

            if (intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                entity.position.x, entity.position.y, entity.position.x + Constants.WALL_WIDTH, entity.position.y)
                || intersects(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y,
                    entity.position.x, entity.position.y + entity.length, entity.position.x + Constants.WALL_WIDTH, entity.position.y + entity.length)) {
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
 * @param {Object} entities
 * @returns {boolean} is it colliding
 */
function checkPlayerMoveEntities(playerPosition, newPosition, entities) {
    let x = newPosition.x - playerPosition.x;
    let y = newPosition.y - playerPosition.y;

    for (let entityId in entities) {
        let entity = entities[entityId];
        if (entity.type === Constants.ENTITY_WALL) {
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
                if (checkLineAgainstWall(pos, {x: pos.x + x, y: pos.y + y}, entity)) return true;
            }
        }
    }

    return false;
}

function handleBulletWallCollision(bulletEntity, entities, worldWidth, worldHeight) {
    for (let entityId in entities) {
        let entity = entities[entityId];
        if (entity.type === Constants.ENTITY_WALL) {
            /* TODO
             * it doesn't take into account the bullet's size
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

                return;
            }
        }
    }
}

module.exports = {
    checkMoveEntities: checkPlayerMoveEntities,
    handleBulletWallCollision
};