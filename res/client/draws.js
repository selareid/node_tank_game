const Draw = {
    updateSideBar: function () {
        //draw user at top
        $('#userListP').html(`${userId}: <br>&emsp; position: {x: ${localUserList[userId].position.x}, y: ${localUserList[userId].position.y}}`);

        //draw other users
        for (let uId in localUserList) {
            if (uId == userId) continue;
            $('#userListP').append(`<br>${uId}: <br>&emsp; position: {x: ${Math.round(localUserList[uId].position.x)}, y: ${Math.round(localUserList[uId].position.y)}}`);
        }
    },

    drawBoard: function () {
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
        context.strokeStyle = '#000';
        //top
        context.moveTo(p - topLeftPos.x * 5 - worldInfo.width * 5 / 2, p - topLeftPos.y * 5 - worldInfo.height * 5 / 2);
        context.lineTo(p - topLeftPos.x * 5 + worldInfo.width * 5 / 2, p - topLeftPos.y * 5 - worldInfo.height * 5 / 2);
        //bottom
        context.moveTo(p - topLeftPos.x * 5 - worldInfo.width * 5 / 2, p - topLeftPos.y * 5 + worldInfo.height * 5 / 2);
        context.lineTo(p - topLeftPos.x * 5 + worldInfo.width * 5 / 2, p - topLeftPos.y * 5 + worldInfo.height * 5 / 2);
        //right
        context.moveTo(p - topLeftPos.x * 5 + worldInfo.width * 5 / 2, p - topLeftPos.y * 5 - worldInfo.height * 5 / 2);
        context.lineTo(p - topLeftPos.x * 5 + worldInfo.width * 5 / 2, p - topLeftPos.y * 5 + worldInfo.height * 5 / 2);
        //left
        context.moveTo(p - topLeftPos.x * 5 - worldInfo.width * 5 / 2, p - topLeftPos.y * 5 - worldInfo.height * 5 / 2);
        context.lineTo(p - topLeftPos.x * 5 - worldInfo.width * 5 / 2, p - topLeftPos.y * 5 + worldInfo.height * 5 / 2);


        context.fillStyle = 'rgba(255,255,255)';
        context.fillRect(p - topLeftPos.x * 5 - worldInfo.width * 5 / 2, p - topLeftPos.y * 5 - worldInfo.height * 5 / 2, worldInfo.width * 5, worldInfo.height * 5);

        context.lineWidth = 1;
        context.stroke();
        //draw world edge lines end

        //draw terrain start
        if (localGameStateLatest.terrain) {
            for (let terrainId in localGameStateLatest.terrain) {
                let terrain = localGameStateLatest.terrain[terrainId];

                switch (terrain.type) {
                    case Constants.TERRAIN_WALL:
                        context.beginPath();
                        context.fillStyle = 'rgba(60,60,60,0.85)';
                        context.fillRect(p + (terrain.position.x) * 5 - topLeftPos.x * 5, p + terrain.position.y * 5 - topLeftPos.y * 5,
                            terrain.orientation === Constants.ORIENTATION_VERTICAL ? Constants.WALL_WIDTH * 5 : terrain.length * 5, terrain.orientation === Constants.ORIENTATION_VERTICAL ? terrain.length * 5 : Constants.WALL_WIDTH * 5);
                        context.stroke();
                        break;
                }
            }
        }
        //draw terrain end

        //draw entities start
        if (localGameStateLatest.entities) {
            for (let entityId in localGameStateLatest.entities) {
                let entity = localGameStateLatest.entities[entityId];

                switch (entity.type) {
                    case Constants.ENTITY_BULLET:
                        context.beginPath();
                        context.strokeStyle = 'rgba(0,0,0,0)';
                        context.fillStyle = 'rgba(255,0,0,0.85)';
                        context.arc(p + (entity.position.x) * 5 - topLeftPos.x * 5, p + entity.position.y * 5 - topLeftPos.y * 5, Constants.BULLET_SIZE / 2 * 5, 0, 2 * Math.PI);
                        context.moveTo(p + (entity.position.x) * 5 - topLeftPos.x * 5, p + entity.position.y * 5 - topLeftPos.y * 5);
                        context.lineTo(p + (entity.position.x) * 5 - topLeftPos.x * 5 + entity.velocity.x * Constants.BULLET_SIZE * 5, p + entity.position.y * 5 - topLeftPos.y * 5 + entity.velocity.y * Constants.BULLET_SIZE * 5);
                        context.fill();
                        context.stroke();
                        break;
                }
            }
        }
        //draw entities end

        //draw players start
        for (let uId in localUserList) {
            let u = localUserList[uId];

            context.fillStyle = !u.dead ? userId == uId ? 'rgba(0,255,0,0.75)' : 'rgba(64,64,285,0.75)' : 'rgba(127,127,127,0.76)';
            context.fillRect(p + u.position.x * 5 - Constants.PLAYER_SIZE / 2 * 5 - topLeftPos.x * 5, p + u.position.y * 5 - Constants.PLAYER_SIZE / 2 * 5 - topLeftPos.y * 5, 40, 40);
            // context.fillStyle = '#7b7b7b'; //the stick shootie thingy not in use
            // context.fillRect(p+u.position.x*5-topLeftPos.x*5-5, p+u.position.y*5-Constants.PLAYER_SIZE/2*5-topLeftPos.y*5-10, 10, 20);

            //debugging player center position circle
            // context.beginPath();
            // context.strokeStyle = 'rgba(0,0,0,0)';
            // context.fillStyle = 'rgba(255,0,0,0.85)';
            // context.arc(p + (u.position.x) * 5 - topLeftPos.x * 5, p + u.position.y * 5 - topLeftPos.y * 5, Constants.BULLET_SIZE / 2 * 5, 0, 2 * Math.PI);
            // context.moveTo(p + (u.position.x) * 5 - topLeftPos.x * 5, p + u.position.y * 5 - topLeftPos.y * 5);
            // context.fill();
            // context.stroke();
        }
        //draw players end
    },

    center: function (redraw = true) {
        topLeftPos = {x: localUserList[userId].position.x - bw / 2, y: localUserList[userId].position.y - bh / 2};

        if (redraw) this.drawBoard();
    }
};