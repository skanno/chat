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
    console.log('connected');
    socket.on('message', function(msg) {
        console.log(`message: ${msg}`);
        io.emit('message', msg);
    });
});

http.listen(PORT, function() {
    console.log(`server listening. Port:${PORT}`);
});