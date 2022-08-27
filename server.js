import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import moment from 'moment-timezone';
import { addMessage, getMessageList } from './storage.js';
import config from 'config';

const PORT = process.env.PORT || config.get('server_port');
const CORS_ORIGIN = config.get('cors_origin');
let app = express();
let http = createServer(app);
let io = new Server(http, {
    cors: {
        origin: CORS_ORIGIN
    }
});

io.on('connection', function(socket) {
    /**
     * 入室をします。
     */
    socket.on('join_room', function(roomName) {
        console.log(`Call, join. Room Name: ${roomName}`);
        socket.join(roomName);
        getMessageList(roomName, (error, results) => {
            io.to(roomName).emit('show_old_message_list', results);
        });
    });

    /**
     * 退室をします。
     */
    socket.on('leave_room', function(roomName) {
        console.log(`Call, leave. Room Name: ${roomName}`);
        socket.leave(roomName);
    });

    /**
     * メッセージを受信し配信します。
     */
    socket.on('send_message', function(oneMessage) {
        oneMessage.createAt = moment().tz("Asia/Tokyo").format('YYYY-MM-DD HH:mm:ss');
        console.log(`Call, message. Room Name: ${oneMessage.roomName}. Message: ${oneMessage.message}.`);
        addMessage(oneMessage.roomName, oneMessage.userName, oneMessage.message);
        io.to(oneMessage.roomName).emit('show_message', oneMessage);
    });
});

http.listen(PORT, function() {
    console.log(`server listening. Port:${PORT}`);
});