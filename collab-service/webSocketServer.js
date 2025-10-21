import { WebSocketServer } from "ws";
import { initialiseWebSocket } from "./websockets/socketConnection.js";
import logger from "./utils/logger.js";

//Set up Websocket Server to handle incoming connection requests and heartbeat mechanism
export default function initWebSocketServer() {
  const webSocketServer = new WebSocketServer({ noServer: true });
  const roomToData = new Map(); // stores session_id to [ydoc, [user1, user2]]

  //Handles client connection
  webSocketServer.on("connection", (ws, request) => {
    logger.info("WebsocketServer started");
    initialiseWebSocket(webSocketServer, ws, request, roomToData);
  });

  setInterval(() => {
    webSocketServer.clients.forEach((ws) => {
      if (!ws.isAlive) {
        logger.info(`${ws.userId} websocket disconnected`);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  webSocketServer.on("close", () => clearInterval(interval));
  return webSocketServer;
}
