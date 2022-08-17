import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const PORT = process.env.PORT || 3000;
const DIR = path.dirname(new URL(import.meta.url).pathname);

let app = express();
let http = createServer(app);
let io = new Server(http);

app.get('/' , function(req, res) {
    res.sendFile(`${DIR}/index.html`);
});

io.on('connection', function(socket) {
    console.log('connected');
    socket.on('message', function(msg) {
        console.log(`message: ${msg}`);
        io.emit('message', msg);
    });
});

http.listen(PORT, function(){
    console.log(`server listening. Port:${PORT}`);
});