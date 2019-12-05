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
    for (let x = 0; x <= bw; x += 10) {
        context.beginPath();

        context.strokeStyle = !worldInfo || x+topLeftPos.x < worldInfo.width/2 ? 'black' : 'red';

        context.moveTo(0.5 + x*5 + p, p);
        context.lineTo(0.5 + x*5 + p, bh*5 + p);

        context.font = '10px sans-serif';
        context.fillStyle = 'green';
        context.fillText(Math.floor(topLeftPos.x+x), -5 + x*5 + p, p);

        context.stroke();
    }

    for (let y = 0; y <= bh; y += 10) {
        context.beginPath();

        context.strokeStyle = !worldInfo || y+topLeftPos.y < worldInfo.width/2 ? 'black' : 'red';

        context.moveTo(p, 0.5 + y*5 + p);
        context.lineTo(bw*5 + p, 0.5 + y*5 + p);
        context.font = '10px sans-serif';
        context.fillStyle = 'green';
        context.fillText(Math.floor(topLeftPos.y+y), 0, +5 + y*5 + p);

        context.stroke();
    }
    // context.strokeStyle = "black";
    // context.stroke();
    //draw grid end

    //draw entities start
    if (localGameStateLatest.entities) {
        for (let entityId in localGameStateLatest.entities) {
            let entity = localGameStateLatest.entities[entityId];

            switch (entity.type) {
                case Constants.ENTITY_WALL:
                    context.fillStyle = 'rgba(60,60,60,0.85)';
                    context.fillRect(p+entity.position.x*5-topLeftPos.x*5, p+entity.position.y*5-topLeftPos.y*5,
                        entity.orientation === Constants.ORIENTATION_HORIZONTAL ? 10*5 : entity.length*5, entity.orientation === Constants.ORIENTATION_HORIZONTAL ? entity.length*5 : 10*5);
                    break;
            }
        }
    }
    //draw entities end

    //draw players start
    for (let uId in localUserList) {
        let u = localUserList[uId];

        context.fillStyle = userId == uId ? 'rgba(0,255,0,0.75)' : 'rgba(64,64,285,0.75)';
        context.fillRect(p+u.position.x*5-20-topLeftPos.x*5, p+u.position.y*5-20-topLeftPos.y*5, 40, 40);
    }
    //draw players end
}


function center(redraw = true) {
    topLeftPos = {x: localUserList[userId].position.x-bw/2, y: localUserList[userId].position.y-bh/2};

    if (redraw) drawBoard();
}