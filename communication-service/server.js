const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, { cors: { origin: "*" } });

const sessions = {};

io.on("connection", (socket) => {

  socket.on("join-session", ({ sessionID, username, peerID }) => {
    socket.join(sessionID);
    
    // Create a new session
    if (!sessions[sessionID]) {
      sessions[sessionID] = {}
    }

    // Add user's information to the session
    sessions[sessionID][username] = { peerID, socketId: socket.id };

    for (const user in sessions[sessionID]) {
      if (user != username) {
        io.to(socket.id).emit("peer-ready", {
          peerID: sessions[sessionID][user].peerID,
          username: user
        });
      }
    }

    for (const user in sessions[sessionID]) {
      if (user !== username) {
        const socketId = sessions[sessionID][user].socketId;
        io.to(socketId).emit("peer-ready", {
          peerID: peerID,
          username: username
        });
      }
    }
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    for (const sessionID in sessions) {
      for (const username in sessions[sessionID]) {
        if (sessions[sessionID][username].socketId === socket.id) {
          delete sessions[sessionID][username];
          socket.to(sessionID).emit("user-left", { username });
          if (Object.keys(sessions[sessionID]).length === 0) {
            delete sessions[sessionID];
          }
          break;
        }
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});