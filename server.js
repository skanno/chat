import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from 'config';

const PORT = process.env.PORT || config.get('port');
const CORS_ORIGIN = config.get('origin');
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
    socket.on('message', function(msg) {
        console.log(`Call, message. Room Name: ${msg.roomName}. Message: ${msg.body}.`);
        io.to(msg.roomName).emit('message', msg.body);
    });
});

http.listen(PORT, function() {
    console.log(`server listening. Port:${PORT}`);
});