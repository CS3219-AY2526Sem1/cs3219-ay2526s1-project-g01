//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2)https://karlhadwen.medium.com/node-js-websocket-tutorial-real-time-chat-room-using-multiple-clients-44a8e26a953e
// for broadcasting message

/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-09-23
 * Purpose: To understand how to implement heart-beat mechanism and prevent socket timeout
 * Author Review: I validated correctness, security, and performance of the code and modified the code to fit use case
 */

import * as Y from "yjs";
import {
  handleSocketConnection,
  parseCursorUpdate,
  handleInitialDocSync,
  broadcastToRoom,
  handleSocketDisconnection,
} from "./socketEventHandlers.js";

//Initialises backend socket events
function initialiseWebSocket(wss, ws, request, roomToDocMap) {
  const path_params = request.url.split("/");
  const userId = path_params[2];
  const roomId = path_params[3];

  ws.isAlive = true;
  ws.room = roomId;
  ws.userId = userId;
  handleSocketConnection(roomToDocMap, userId, roomId);
  const doc = roomToDocMap.get(roomId).doc;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("error", console.error);

  ws.on("message", (update) => {
    const cursorData = parseCursorUpdate(update);

    if (cursorData != null) {
      broadcastToRoom(wss, ws, roomId, cursorData);
      return;
    }

    if (handleInitialDocSync(update, ws, doc)) {
      return;
    }

    const yUpdate = new Uint8Array(update);
    Y.applyUpdate(doc, yUpdate);
    broadcastToRoom(wss, ws, roomId, yUpdate);
  });

  ws.on("close", () => {
    logger.info("websocket on server closed");
    handleSocketDisconnection(ws, wss, roomToDocMap);
  });
}
export { initialiseWebSocket };
