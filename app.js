const express = require('express');
const http = require('http');
const Filter = require('bad-words');
const socketIo = require('socket.io');
const chatRouter = require('./src/router/chatRouter');
const path = require('path');
const cors = require('cors');
const { reloadMessage, generatedLocation } = require('./src/message');

// import express from 'express';
// import http from 'http';
// import Filter from 'bad-words';
// import socketIo from 'socket.io';
// import chatRouter from './src/router/chatRouter';
// import path from 'path';
// import fetch from 'node-fetch';
// import { reloadMessage, generatedLocation } from './src/message';

// mod.cjs
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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

const callAPI =  async (data) => {

    const response = await fetch("https://gsms.co.in/mlm/api/add_chat", {
        method: 'post',
        body: JSON.stringify({name: data.name, message: data.message}),
        headers: {"Content-Type": "multipart/form-data"}
    });

    const data_1 = await response.json()

console.log("Api ========> ", data_1)

    
}


io.on('connection', (socket) => {
    console.log('new client connect ...');

    socket.emit('ServerMessage', reloadMessage('welcome from server side.'));

    socket.on("createRoom", (user, cb) => {
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('ServerMessage', reloadMessage(`${user.name} join a room !`));
    });


    socket.on('SendMessage', (userData, callback) => {
        const filter = new Filter();
        if (filter.isProfane(userData.message)) {
            return callback('profane reject !')
        }
        io.to(userData.room).emit('ServerMessage', reloadMessage(userData.message));
        callAPI({name: userData.name, message: userData.message});
        callback();
    });

    // socket.on("sendLocation", (location, callback) => {
    //     io.emit("shareLocation", generatedLocation(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
    //     callback('all clients share the location')

    // });

    socket.on('disconnect', () => {
        io.emit('ServerMessage', reloadMessage('one user is disconnect !'));
    });
});

app.use(chatRouter);



server.listen(port, () => {
    console.log('server up on ' + port + '....');
})