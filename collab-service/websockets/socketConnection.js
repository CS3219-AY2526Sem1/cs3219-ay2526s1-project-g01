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
  parseCursorUpdate,
  handleInitialDocSync,
  broadcastToRoom,
  handleSocketDisconnection,
} from "./socketEventHandlers.js";
import logger from "../utils/logger.js";
import { saveLocalState } from "../utils/sessionDataHandler.js";

//Initialises backend socket events
async function initialiseWebSocket(wss, ws, request, redisDb, roomToDataMap) {
  // const path_params = request.url.split("/");
  // const userId = path_params[2];
  // const sessionId = path_params[3];
  // const sessionData = roomToDataMap[sessionId];

  const fullUrl = `ws://host${request.url}`;
  const url = new URL(fullUrl);
  logger.info(fullUrl);
  const sessionId = url.searchParams.get("sessionId");
  logger.info(sessionId);
  //validate the connection here
  ws.isAlive = true;
  ws.sessionId = sessionId;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("error", console.error);

  ws.on("message", (update) => {
    const cursorData = parseCursorUpdate(update);
    const localSessionData = roomToDataMap.get(sessionId);
    const doc = localSessionData.doc;

    if (cursorData != null) {
      broadcastToRoom(wss, ws, sessionId, cursorData);
      return;
    }

    if (handleInitialDocSync(update, ws, doc)) {
      return;
    }

    const yUpdate = new Uint8Array(update);
    Y.applyUpdate(doc, yUpdate);
    broadcastToRoom(wss, ws, sessionId, yUpdate);

    //Save local state to redis if last saved more than 30 seconds ago
    if (Date.now() - Number(localSessionData.lastSavedAt) >= 30000) {
      const key = `session:${sessionId}`;
      localSessionData.lastSavedAt = Date.now();
      saveLocalState(key, redisDb, localSessionData);
      logger.info("state saved in redis");
    }
  });

  ws.on("close", async () => {
    logger.info("websocket on server closed");
    await handleSocketDisconnection(ws, wss, roomToDataMap, redisDb);
  });
}
export { initialiseWebSocket };
