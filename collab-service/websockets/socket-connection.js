//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2)https://karlhadwen.medium.com/node-js-websocket-tutorial-real-time-chat-room-using-multiple-clients-44a8e26a953e
// for broadcasting message

import WebSocket from "ws";
import * as Y from "yjs";
import logger from "../utils/logger.js";

function getYDoc(roomToDocMap, userId, roomId) {
  let doc;
  if (!roomToDocMap.has(roomId)) {
    doc = new Y.Doc();
    roomToDocMap.set(roomId, [doc, [userId]]);
  } else {
    const [stored_doc, users] = roomToDocMap.get(roomId);
    users.push(userId);
    doc = stored_doc;
  }
  return doc;
}

function handlePing(ws, message) {
  const isPing =
    (Buffer.isBuffer(message) && message.toString() === "ping") ||
    (typeof message === "string" && message === "ping");

  if (isPing) {
    ws.send("pong");
    return true;
  }
  return false;
}

function broadcastToRoom(webSocketServer, websocket, roomId, update) {
  webSocketServer.clients.forEach((client) => {
    logger.info(`client ${client.userId}`);
    if (
      client !== websocket &&
      client.readyState === WebSocket.OPEN &&
      client.room === roomId
    ) {
      logger.info(`WSS Sends update back to other user ${client.userId}`);
      logger.info(`what is sent from server:${update}`);
      client.send(update);
    }
  });
}

function handleSocketConnection(wss, ws, request, roomToDocMap) {
  const path_params = request.url.split("/");
  const userId = path_params[2];
  const roomId = path_params[3];

  ws.room = roomId;
  ws.userId = userId;
  const doc = getYDoc(roomToDocMap, userId, roomId);

  ws.on("error", console.error);

  ws.on("message", (update) => {
    if (handlePing(ws, update)) {
      return;
    }
    logger.info(`Message Received from ${ws.userId}`);
    const yUpdate = new Uint8Array(update);
    Y.applyUpdate(doc, yUpdate);
    broadcastToRoom(wss, ws, roomId, yUpdate);
  });

  ws.on("close", function () {
    roomToDocMap.delete(userId);
  });
}
export { handleSocketConnection };
