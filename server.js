const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket= require('socket.io');
const io = socket(server);

const rooms = {};

io.on("connection", socket => {
    socket.on("join room", roomID => {
        if rooms[roomID]{
            rooms[roomID].push(socket.id)
        }else{
            rooms[roomID] = [socket.id]
        }
        const otherUsers = rooms[roomID].find(id => id !== socket.id)

        if otherUsers{
            socket.emit("other user", otherUsers);
            socket.to(otherUsers).emit("user joined", socket.id);
        }
    });

    socket.on('offer', payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

});

server.listen(8000, () => console.log("server is running in 8000"))