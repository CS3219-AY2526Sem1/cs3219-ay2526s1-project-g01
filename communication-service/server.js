const express = require('express');
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
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


    // Offer to the other user
    socket.on("offer", ({ offer, username, sessionID }) => {
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                io.to(sessions[sessionID][user]).emit("offer-made", offer);
            }
        }
    });


    // Answer to the other user
    socket.on("answer", ({ answer, username, sessionID }) => {
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                io.to(sessions[sessionID][user]).emit("offer-accepted", answer );

            }
        }
    })

    // Exchange ice candidates 
    socket.on("ice-candidate", ({ candidate, username, sessionID }) => {
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                io.to(sessions[sessionID][user]).emit("ice-candidate", candidate);
            }

        }
    })

    // Disconnect
    socket.on("disconnect", () => {
        for (const sessionID in sessions) {
            for (const users in sessions[sessionID]) {
                if (sessions[sessionID][users] == socket.id) {
                    delete sessions[sessionID][users]
                }
            }
        }
    })

})


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});