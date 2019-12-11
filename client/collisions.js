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

function moveCollidingWithEntity(x, y) {
    for (let entityId in localGameStateLatest.entities) {
        let entity = localGameStateLatest.entities[entityId];
        if (entity.type === Constants.ENTITY_WALL) {
            //the wall .position is the top-left corner

            /* one line is the movement line
             * where points 1 & 2 are the original position
             * points 3 & 4 are the move to position
             * Other line is edge of wall
             */

            switch (entity.orientation) {
                case Constants.ORIENTATION_HORIZONTAL:
                    for (let pos of [
                        {
                            x: localUserList[userId].position.x - Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y - Constants.PLAYER_SIZE / 2
                        },
                        {
                            x: localUserList[userId].position.x - Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y + Constants.PLAYER_SIZE / 2
                        },
                        {
                            x: localUserList[userId].position.x + Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y - Constants.PLAYER_SIZE / 2
                        },
                        {
                            x: localUserList[userId].position.x + Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y + Constants.PLAYER_SIZE / 2
                        }
                    ]) {
                        if (intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                            entity.position.x, entity.position.y, entity.position.x + entity.length, entity.position.y)
                            || intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                                entity.position.x, entity.position.y + Constants.WALL_WIDTH, entity.position.x + entity.length, entity.position.y + Constants.WALL_WIDTH)
                            || intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                                entity.position.x, entity.position.y, entity.position.x, entity.position.y + Constants.WALL_WIDTH)
                            || intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                                entity.position.x + entity.length, entity.position.y, entity.position.x + entity.length, entity.position.y + Constants.WALL_WIDTH)) {
                            return true;
                        }
                    }
                    break;
                case Constants.ORIENTATION_VERTICAL:
                    for (let pos of [
                        {
                            x: localUserList[userId].position.x - Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y - Constants.PLAYER_SIZE / 2
                        },
                        {
                            x: localUserList[userId].position.x - Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y + Constants.PLAYER_SIZE / 2
                        },
                        {
                            x: localUserList[userId].position.x + Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y - Constants.PLAYER_SIZE / 2
                        },
                        {
                            x: localUserList[userId].position.x + Constants.PLAYER_SIZE / 2,
                            y: localUserList[userId].position.y + Constants.PLAYER_SIZE / 2
                        }
                    ]) {
                        if (intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                            entity.position.x, entity.position.y, entity.position.x, entity.position.y + entity.length)
                            || intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                                entity.position.x + Constants.WALL_WIDTH, entity.position.y, entity.position.x + Constants.WALL_WIDTH, entity.position.y + entity.length)
                            || intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                                entity.position.x, entity.position.y, entity.position.x + Constants.WALL_WIDTH, entity.position.y)
                            || intersects(pos.x, pos.y, pos.x + x, pos.y + y,
                                entity.position.x, entity.position.y + entity.length, entity.position.x + Constants.WALL_WIDTH, entity.position.y + entity.length)) {
                            return true;
                        }
                    }
                    break;
            }
        }
    }

    return false;
}