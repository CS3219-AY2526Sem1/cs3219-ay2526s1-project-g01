import "dotenv/config";

const express = require('express');
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// GCP Cloud Run injects PORT, default to 8080 if not set
const port = process.env.PORT || 8080;

app.use(cors());

const io = new Server(server, { 
  cors: { origin: "*" },
  transports: ['websocket', 'polling'], // Support both for better compatibility
  pingTimeout: 60000,
  pingInterval: 25000
});

const sessions = {};

// Health check endpoint (required for GCP)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    activeSessions: Object.keys(sessions).length
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "WebRTC Signaling Server",
    status: "running"
  });
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join session room and informs the rest
    socket.on("join-session", ({ sessionID, username }) => {
        console.log(`User ${username} joining session ${sessionID}`);
        socket.join(sessionID);

        // Create a new session
        if (!sessions[sessionID]) {
            sessions[sessionID] = {}
        }

        // Add user's information to the session
        sessions[sessionID][username] = socket.id;

        // Inform ownself about existing peers
        for (const user in sessions[sessionID]) {
            if (user != username) {
                io.to(socket.id).emit("peer-ready", {
                    username: user
                });
            }
        }

        // Inform the other users that this user has joined
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
        console.log(`Offer from ${username} in session ${sessionID}`);
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                io.to(sessions[sessionID][user]).emit("offer-made", offer);
            }
        }
    });

    // Answer to the other user
    socket.on("answer", ({ answer, username, sessionID }) => {
        console.log(`Answer from ${username} in session ${sessionID}`);
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                io.to(sessions[sessionID][user]).emit("offer-accepted", answer);
            }
        }
    });

    // Exchange ice candidates 
    socket.on("ice-candidate", ({ candidate, username, sessionID }) => {
        for (const user in sessions[sessionID]) {
            if (user !== username) {
                io.to(sessions[sessionID][user]).emit("ice-candidate", candidate);
            }
        }
    });

    // Disconnect - notify other peers
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        
        for (const sessionID in sessions) {
            for (const username in sessions[sessionID]) {
                if (sessions[sessionID][username] == socket.id) {
                    console.log(`User ${username} left session ${sessionID}`);
                    
                    // Remove user from session
                    delete sessions[sessionID][username];
                    
                    // Notify other users in the session
                    for (const otherUser in sessions[sessionID]) {
                        io.to(sessions[sessionID][otherUser]).emit("peer-left", {
                            username: username
                        });
                    }
                    
                    // Clean up empty sessions
                    if (Object.keys(sessions[sessionID]).length === 0) {
                        delete sessions[sessionID];
                    }
                }
            }
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});