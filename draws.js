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
    for (var x = 0; x <= bw; x += 10) {
        context.moveTo(0.5 + x*5 + p, p);
        context.lineTo(0.5 + x*5 + p, bh*5 + p);
        context.font = '10px sans-serif';
        context.fillStyle = 'green';
        context.fillText(Math.floor(topLeftPos.x+x), -5 + x*5 + p, p);
    }

    for (var x = 0; x <= bh; x += 10) {
        context.moveTo(p, 0.5 + x*5 + p);
        context.lineTo(bw*5 + p, 0.5 + x*5 + p);
        context.font = '10px sans-serif';
        context.fillStyle = 'green';
        context.fillText(Math.floor(topLeftPos.y+x), 0, +5 + x*5 + p)
    }
    context.strokeStyle = "black";
    context.stroke();
    //draw grid end

    //draw entities start
    if (localGameStateLatest.entities) {
        for (let entityId in localGameStateLatest.entities) {
            let entity = localGameStateLatest.entities[entityId];

            switch (entity.type) {
                case Entities.ENTITY_WALL:
                    context.fillStyle = 'rgba(60,60,60,0.85)';
                    context.fillRect(p+entity.position.x*5-topLeftPos.x*5, p+entity.position.y*5-topLeftPos.y*5,
                        entity.orientation === Entities.ORIENTATION_HORIZONTAL ? 10*5 : entity.length*5, entity.orientation === Entities.ORIENTATION_HORIZONTAL ? entity.length*5 : 10*5);
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