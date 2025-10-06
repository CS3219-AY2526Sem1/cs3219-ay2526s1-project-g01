//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2) https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
// for ws framework

import http from "http";
import "dotenv/config";
import app from "./app.js";
import { WebSocketServer } from "ws";
import { startDB } from "./db/connection.js";
import { handleSocketConnection } from "./websockets/socket-connection.js";

const port = process.env.PORT;
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ noServer: true });
const roomToData = new Map(); // stores session_id to [ydoc, [user1, user2]]

async function startServer() {
  try {
    await startDB();
    server.listen(port);
    console.log(`Collab-service-server listening on ${port}`);
  } catch (error) {
    console.log("Unable to start collab-service server");
  }
}

server.on("upgrade", (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (ws) => {
    webSocketServer.emit("connection", ws, request);
  });
});

webSocketServer.on("connection", (ws, request) => {
  handleSocketConnection(webSocketServer, ws, request, roomToData);
});

startServer();
