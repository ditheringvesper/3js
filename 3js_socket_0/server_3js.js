const express = require("express");
const app = express();

app.use(express.static("public"));

const http = require("http").createServer(app);
const server = app.listen(5555);
console.log("Server is running on http://localhost:5555");
const io = require("socket.io")().listen(server);

const peers = {};
io.on("connection", (socket) => {
    peers[socket.id] = {};

    console.log('current peers: ' + JSON.stringify(peers));

    socket.on("dialogue", (data) => {
        console.log('received activity: ' + data + 'from ' + socket.id);
        let dataWithId = { from: socket.id, data: data };
        // socket.broadcast.emit('received activity: ' + JSON.stringify(dataWithId.data) + 'from ' + dataWithId.from);
        socket.broadcast.emit("dialogue", dataWithId);
    });


});