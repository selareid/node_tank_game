function updateSideBar() {
    //draw user at top
    $('#userListP').html(`${userId}: <br>&emsp; position: {x: ${localUserList[userId].position.x}, y: ${localUserList[userId].position.y}}`);

    //draw other users
    for (let uId in localUserList) {
        if (uId == userId) continue;
        $('#userListP').append(`<br>${uId}: <br>&emsp; position: {x: ${localUserList[uId].position.x}, y: ${localUserList[uId].position.y}}`);
    }
}



function drawBoard() {
    context.clearRect(0, 0, cw, ch); //clears the canvas

    //draw grid start
    // for (let x = 0; x <= bw; x += 10) {
    //     context.beginPath();
    //
    //     if (!worldInfo || Math.abs(x+topLeftPos.x) < worldInfo.width/2) {
    //         context.strokeStyle = 'black';
    //         context.lineWidth = 1;
    //         if (x !== 0) continue;
    //     }
    //     else {
    //         context.strokeStyle = 'red';
    //         context.lineWidth = 5;
    //     }
    //
    //     context.moveTo(0.5 + x*5 + p, p);
    //     context.lineTo(0.5 + x*5 + p, bh*5 + p);
    //
    //     context.font = '10px sans-serif';
    //     context.fillStyle = 'green';
    //     context.fillText(Math.floor(topLeftPos.x+x), -5 + x*5 + p, p);
    //
    //     context.stroke();
    // }
    //
    // for (let y = 0; y <= bh; y += 10) {
    //     context.beginPath();
    //
    //     if (!worldInfo || Math.abs(y+topLeftPos.y) < worldInfo.width/2) {
    //         context.strokeStyle = 'black';
    //         context.lineWidth = 1;
    //         if (y !== 0) continue;
    //     }
    //     else {
    //         context.strokeStyle = 'red';
    //         context.lineWidth = 5;
    //     }
    //
    //     context.moveTo(p, 0.5 + y*5 + p);
    //     context.lineTo(bw*5 + p, 0.5 + y*5 + p);
    //     context.font = '10px sans-serif';
    //     context.fillStyle = 'green';
    //     context.fillText(Math.floor(topLeftPos.y+y), 0, +5 + y*5 + p);
    //
    //     context.stroke();
    // }
    // context.strokeStyle = "black";
    // context.stroke();
    //draw grid end

    //draw world edge lines start
    context.beginPath();
    //top
    context.moveTo(p-topLeftPos.x*5-worldInfo.width*5/2, p-topLeftPos.y*5-worldInfo.height*5/2);
    context.lineTo(p-topLeftPos.x*5+worldInfo.width*5/2, p-topLeftPos.y*5-worldInfo.height*5/2);
    //bottom
    context.moveTo(p-topLeftPos.x*5-worldInfo.width*5/2, p-topLeftPos.y*5+worldInfo.height*5/2);
    context.lineTo(p-topLeftPos.x*5+worldInfo.width*5/2, p-topLeftPos.y*5+worldInfo.height*5/2);
    //right
    context.moveTo(p-topLeftPos.x*5+worldInfo.width*5/2, p-topLeftPos.y*5-worldInfo.height*5/2);
    context.lineTo(p-topLeftPos.x*5+worldInfo.width*5/2, p-topLeftPos.y*5+worldInfo.height*5/2);
    //left
    context.moveTo(p-topLeftPos.x*5-worldInfo.width*5/2, p-topLeftPos.y*5-worldInfo.height*5/2);
    context.lineTo(p-topLeftPos.x*5-worldInfo.width*5/2, p-topLeftPos.y*5+worldInfo.height*5/2);


    context.fillStyle = 'rgba(255,255,255)';
    context.fillRect(p-topLeftPos.x*5-worldInfo.width*5/2, p-topLeftPos.y*5-worldInfo.height*5/2, worldInfo.width*5, worldInfo.height*5);

    context.lineWidth = 1;
    context.stroke();
    //draw world edge lines end

    //draw entities start
    if (localGameStateLatest.entities) {
        context.beginPath();

        for (let entityId in localGameStateLatest.entities) {
            let entity = localGameStateLatest.entities[entityId];

            switch (entity.type) {
                case Constants.ENTITY_WALL:
                    context.fillStyle = 'rgba(60,60,60,0.85)';
                    context.fillRect(p + (entity.position.x) * 5 - topLeftPos.x * 5, p + entity.position.y * 5 - topLeftPos.y * 5,
                        entity.orientation === Constants.ORIENTATION_VERTICAL ? Constants.WALL_WIDTH * 5 : entity.length * 5, entity.orientation === Constants.ORIENTATION_VERTICAL ? entity.length * 5 : Constants.WALL_WIDTH * 5);
                    break;
                case Constants.ENTITY_BULLET:
                    context.fillStyle = 'rgba(0,0,0,0.85)';
                    context.arc(p + (entity.position.x) * 5 - topLeftPos.x * 5, p + entity.position.y * 5 - topLeftPos.y * 5, Constants.BULLET_SIZE*5, 0, 2 * Math.PI);
                    context.moveTo(p + (entity.position.x) * 5 - topLeftPos.x * 5, p + entity.position.y * 5 - topLeftPos.y * 5);
                    context.lineTo(p + (entity.position.x) * 5 - topLeftPos.x * 5 + entity.velocity.x*Constants.BULLET_SIZE*5, p + entity.position.y * 5 - topLeftPos.y * 5 + entity.velocity.y*Constants.BULLET_SIZE*5);
                    break;
            }
        }

        context.stroke();
    }
    //draw entities end

    //draw players start
    for (let uId in localUserList) {
        let u = localUserList[uId];

        context.fillStyle = userId == uId ? 'rgba(0,255,0,0.75)' : 'rgba(64,64,285,0.75)';
        context.fillRect(p+u.position.x*5-Constants.PLAYER_SIZE/2*5-topLeftPos.x*5, p+u.position.y*5-Constants.PLAYER_SIZE/2*5-topLeftPos.y*5, 40, 40);
    }
    //draw players end
}


function center(redraw = true) {
    topLeftPos = {x: localUserList[userId].position.x-bw/2, y: localUserList[userId].position.y-bh/2};

    if (redraw) drawBoard();
}