const express = require('express');
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, { cors: { origin: "*" } });

const sessions = {};

io.on("connection", (socket) => {

    // Join session room and informs the rest
    socket.on("join-session", ({ sessionID, username }) => {
        socket.join(sessionID);

        // Create a new session
        if (!sessions[sessionID]) {
            sessions[sessionID] = {}
        }

        // Add user's information to the session
        sessions[sessionID][username] = socket.id;

        // Inform ownself that it has joined the session room
        for (const user in sessions[sessionID]) {
            if (user != username) {
                io.to(socket.id).emit("peer-ready", {
                    username: user
                });
            }
        }

        // Inform the other user that it has joined the session
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                const socketId = sessions[sessionID][user];
                io.to(socketId).emit("peer-ready", {
                    username: username
                });
            }
        }
    });
})


server.listen(3001, () => {
    console.log("Server running on port 3001");
});