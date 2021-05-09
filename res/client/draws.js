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
        if (!userId || ! localUserList || !localUserList[userId]) return;

        if (cw !== window.innerWidth*0.75) socket.emit('disconnect'); //TODO REMOVE THIS SUICIDE

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

        //draw hot bar start
        context.fillStyle = 'rgba(237,220,70,0.91)';
        context.fillRect((cw - hotBarWidth)/2, ch - 10 - hotBarHeight, hotBarWidth, hotBarHeight);

        for (let i = 0; i < Constants.HOT_BAR_SLOTS; i++) {
            if (localUserList[userId].inventory[i]) {

                //draws from image file else colours square
                if (Items[localUserList[userId].inventory[i].id] && Items[localUserList[userId].inventory[i].id].iconImage) {
                    let theImage = new Image(5*10, 5*10);
                    theImage.src = "/tank_game_api" + Items[localUserList[userId].inventory[i].id].iconImage;
                    context.drawImage(theImage, (cw - hotBarWidth) / 2 + i * hotBarWidth / Constants.HOT_BAR_SLOTS + 3, ch - 10 - hotBarHeight + 3, hotBarWidth / Constants.HOT_BAR_SLOTS - 6, hotBarHeight - 6);
                }
                else {
                    if (Items[localUserList[userId].inventory[i].id] && Items[localUserList[userId].inventory[i].id].iconColour) context.fillStyle = Items[localUserList[userId].inventory[i].id].iconColour;
                    else context.fillStyle = 'rgba(0,40,237,0.91)';

                    context.fillRect((cw - hotBarWidth) / 2 + i * hotBarWidth / Constants.HOT_BAR_SLOTS + 3, ch - 10 - hotBarHeight + 3, hotBarWidth / Constants.HOT_BAR_SLOTS - 6, hotBarHeight - 6);
                }
            }
        }

        context.beginPath();
        context.moveTo((cw - hotBarWidth)/2, ch - 10);
        context.lineTo((cw + hotBarWidth)/2, ch - 10);

        context.moveTo((cw - hotBarWidth)/2, ch - 10 - hotBarHeight);
        context.lineTo((cw + hotBarWidth)/2, ch - 10 - hotBarHeight);

        for (let i = (cw - hotBarWidth)/2; i <= (cw + hotBarWidth)/2 + 1; i += hotBarWidth/Constants.HOT_BAR_SLOTS) {
            context.moveTo(i, ch - 10);
            context.lineTo(i, ch - 10 - hotBarHeight);
        }

        //draw selected slot visual feedback
        context.fillStyle = 'rgba(225,225,225,0.51)';
        context.fillRect((cw - hotBarWidth) / 2 + localUserList[userId].selectedHotBar * hotBarWidth / Constants.HOT_BAR_SLOTS, ch - 10 - hotBarHeight, hotBarWidth / Constants.HOT_BAR_SLOTS, hotBarHeight);

        //handle mouse hot bar hover
        if (relativeMousePosition.x > (cw - hotBarWidth)/2 && relativeMousePosition.x < (cw + hotBarWidth)/2
        && relativeMousePosition.y > ch - 10 - hotBarHeight && relativeMousePosition.y < ch - 10) { //is mouse over the hot bar
            // console.log(Math.ceil(((relativeMousePosition.x - cw/2 + hotBarWidth/2) * Constants.HOT_BAR_SLOTS) / hotBarWidth))

            context.fillStyle = 'rgba(255,255,255,0.51)';
            let hoveredSlot = Math.floor(((relativeMousePosition.x - cw/2 + hotBarWidth/2) * Constants.HOT_BAR_SLOTS) / hotBarWidth);

            socket.emit('selectedHotBarChange', hoveredSlot);

            context.fillRect((cw - hotBarWidth) / 2 + hoveredSlot * hotBarWidth / Constants.HOT_BAR_SLOTS, ch - 10 - hotBarHeight, hotBarWidth / Constants.HOT_BAR_SLOTS, hotBarHeight);

            /* (cw - hotBarWidth) / 2 + i * hotBarWidth / Constants.HOT_BAR_SLOTS + 3 = xPos
             * ((cw - hotBarWidth) / 2) + (i * hotBarWidth / Constants.HOT_BAR_SLOTS) = xPos - 3
             * cw/2 - hotBarWidth/2 + i(hotBarWidth)/Constants.HOT_BAR_SLOTS = xPos - 3
             * i(hotBarWidth) = (xPos - 3 - cw/2 + hotBarWidth/2) * Constants.HOT_BAR_SLOTS
             * i = ((xPos - 3 - cw/2 + hotBarWidth/2) * Constants.HOT_BAR_SLOTS) / hotBarWidth
             * Where i is the square being hovered over
             * removed the +3/-3 because it was for the smaller square (for drawing item)
             * Math.ceil(((relativeMousePosition.x - cw/2 + hotBarWidth/2) * Constants.HOT_BAR_SLOTS) / hotBarWidth)
             * this gives 1-start notation hot bar hover
             */
        }

        context.stroke();
        //draw hot bar end

        //handle mouse hover for items start
        if (localUserList[userId].inventory[localUserList[userId].selectedHotBar]) {
            switch (localUserList[userId].inventory[localUserList[userId].selectedHotBar].id) {
                case Constants.ITEM_WALL:
                    context.fillStyle = 'rgba(108,108,108,0.85)';
                    context.fillRect(relativeMousePosition.x - Constants.WALL_WIDTH * 5 / 2, relativeMousePosition.y - Constants.WALL_WIDTH * 5 / 2, Constants.WALL_WIDTH * 5, Constants.WALL_WIDTH * 5);
                    break;
            }
        }
        //handle mouse hover for items end
    },

    center: function (redraw = true) {
        topLeftPos = {x: localUserList[userId].position.x - bw / 2, y: localUserList[userId].position.y - bh / 2};

        if (redraw) this.drawBoard();
    }
};
