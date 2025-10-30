//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2) https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
// for ws framework

import http from "http";
import "dotenv/config";
import app from "./app.js";
import { startDB } from "./db/connection.js";
import { initWebSocketServer } from "./webSocketServer.js";
import logger from "./utils/logger.js";
import { loadAllSessionsFromRedis } from "./utils/sessionDataHandler.js";
import { dbClient } from "./db/connection.js";
import { roomToData } from "./webSocketServer.js";

const port = process.env.PORT;
const server = http.createServer(app);
const webSocketServer = initWebSocketServer();

async function startServer() {
  try {
    await startDB();
    await loadAllSessionsFromRedis(dbClient, roomToData);
    server.listen(port);
    logger.info(`Collab-service-server listening on ${port}`);
  } catch (error) {
    logger.info("Unable to start collab-service server", error);
  }
}

server.on("upgrade", (request, socket, head) => {
  webSocketServer.handleUpgrade(request, socket, head, (ws) => {
    webSocketServer.emit("connection", ws, request);
  });
});

startServer();
