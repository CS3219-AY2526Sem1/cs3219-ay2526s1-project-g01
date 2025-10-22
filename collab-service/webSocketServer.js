import { WebSocketServer } from "ws";
import { initialiseWebSocket } from "./websockets/socketConnection.js";
import logger from "./utils/logger.js";

//Set up Websocket Server to handle incoming connection requests and heartbeat mechanism
export default function initWebSocketServer() {
  const webSocketServer = new WebSocketServer({ noServer: true });
  const roomToData = new Map(); // stores session_id to {doc, users, lastEmptyAt}]
  logger.info("WebsocketServer started!");

  //Handles client connection
  webSocketServer.on("connection", (ws, request) => {
    logger.info("Websocketconnection opened!!");
    initialiseWebSocket(webSocketServer, ws, request, roomToData);
  });

  //Heartbeat mechanism for persistent connection
  const ping_interval = setInterval(() => {
    webSocketServer.clients.forEach((ws) => {
      if (!ws.isAlive) {
        logger.info(`${ws.userId} websocket disconnected`);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  //For clearing of y doc state on server if more than 2 minutes has passed since room is empty
  const state_interval = setInterval(() => {
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
