//With reference to https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js for ws framework

import { WebSocketServer } from "ws";
import { initialiseWebSocket } from "./websockets/socketConnection.js";
import logger from "./utils/logger.js";
import { dbClient } from "./db/connection.js";
export const roomToData = new Map();
export const userToRoom = new Map();

//Set up Websocket Server to handle incoming connection requests and heartbeat mechanism
export function initWebSocketServer() {
  const webSocketServer = new WebSocketServer({ noServer: true });
  // Local session data storage, stores session_id to {ydoc, users, lastEmptyAt, lastSavedAt}
  logger.info("WebsocketServer started!");
  //Handles client connection
  webSocketServer.on("connection", async (ws, request) => {
    logger.info("Websocketconnection opened!!");
    await initialiseWebSocket(
      webSocketServer,
      ws,
      request,
      dbClient,
      roomToData
    );
  });

  //Heartbeat mechanism for persistent connection
  const ping_interval = setInterval(() => {
    webSocketServer.clients.forEach((ws) => {
      if (!ws.isAlive) {
        logger.info(`${ws.userId} websocket disconnected`);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.send(JSON.stringify({ type: "ping" }));
      ws.ping();
    });
  }, 10000);

  //For clearing of y doc state on server and redis if more than 2 minutes has passed since room is empty
  const state_interval = setInterval(async () => {
    const current_time = Date.now();
    for (const [roomId, room] of roomToData.entries()) {
      if (
        room.users.size === 0 &&
        room.lastEmptyAt &&
        current_time - room.lastEmptyAt > 120000
      ) {
        logger.info(
          `Deleting Y.Doc for room ${roomId} (inactive for more than 2min)`
        );
        room.doc.destroy();
        roomToData.delete(roomId);
        const key = `session:${roomId}`;
        await dbClient.del(key);
        logger.info("Deleting state from redisDb");
      }
    }
  }, 60000);

  webSocketServer.on("close", () => {
    logger.info("websocketserver closed");
    clearInterval(ping_interval);
    clearInterval(state_interval);
  });
  return webSocketServer;
}
