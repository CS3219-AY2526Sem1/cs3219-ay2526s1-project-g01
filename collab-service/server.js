//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2) https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
// for ws framework

import http from "http";
import "dotenv/config";
import app from "./app.js";
// import { startDB } from "./db/connection.js";
import initWebSocketServer from "./webSocketServer.js";
const port = process.env.PORT;
const server = http.createServer(app);
const webSocketServer = initWebSocketServer();

async function startServer() {
  try {
    // await startDB();
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

startServer();
