const express = require('express');
const http = require('http');
const Filter = require('bad-words');
const socketIo = require('socket.io');
const chatRouter = require('./src/router/chatRouter');
const path = require('path');
const {reloadMessage, generatedLocation} = require('./src/message');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, './src/public');


app.use(express.json());
app.use(express.static(publicPath))

// let count = 0
// io.on('connection', (socket) => {
//     console.log('new websocket connect...');
//     socket.emit('updateData', count)

//     socket.on('increment', () => {
//         count++
//         // socket.emit('updateData', count);
//         io.emit('updateData', count)
//     });
// })


io.on('connection', (socket) => {
    console.log('new client connect ...');

    socket.emit('ServerMessage', reloadMessage('welcome from server side '));
    socket.broadcast.emit('ServerMessage', reloadMessage('a new user joined !'))
    socket.on('SendMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('profane reject !')
        }
        io.emit('ServerMessage', reloadMessage(message));
        callback();
    });

    socket.on("sendLocation", (location, callback) => {
        io.emit("shareLocation", generatedLocation(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback('all clients share the location')

    });

    socket.on('disconnect', () => {
        io.emit('ServerMessage', reloadMessage('one user is disconnect !'));
    });
});

app.use(chatRouter);



server.listen(port, () => {
    console.log('server up on '+ port + '....');
})