import WebSocket from "ws";
import * as Y from "yjs";
import logger from "../utils/logger.js";

//Handles syncing of code editor with most updated changes by sending the difference to client
function handleInitialDocSync(message, ws, ydoc, wss, sessionId) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "sync") {
      //Inform partner that user joined the room
      const payloadToPartner = {
        type: "partner_join",
      };
      broadcastToRoom(wss, ws, sessionId, JSON.stringify(payloadToPartner));

      //Get and send changes that server ydoc has but client does not
      const initialClientState = Buffer.from(data.ydocState, "base64");
      const clientMissingDiff = Y.encodeStateAsUpdate(ydoc, initialClientState);
      const updateAsString = Buffer.from(clientMissingDiff).toString("base64");
      const update_payload = {
        type: "sync",
        ydocUpdate: updateAsString,
      };
      ws.send(JSON.stringify(update_payload));

      //Encode server state and send to client to determine what client has and server does not
      const serverDocState = Y.encodeStateVector(ydoc);
      const serverStateAsString =
        Buffer.from(serverDocState).toString("base64");
      const req_payload = {
        type: "sync_client",
        ydocState: serverStateAsString,
      };
      ws.send(JSON.stringify(req_payload));
      return true;
    }
  }
  return false;
}

//Handles syncing of server ydoc and partner ydoc with offline changes made by client
function handleClientDocSync(message, ws, ydoc, wss, sessionId) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "sync_client") {
      const yUpdate = Buffer.from(data.ydocUpdate, "base64");
      logger.info(yUpdate.length);
      Y.applyUpdate(ydoc, yUpdate);
      broadcastToRoom(wss, ws, sessionId, yUpdate);
      return true;
    }
  }
}
//Handles client disconnection and inform partner of disconnection
async function handleSocketDisconnection(ws, wss, roomToDocMap, redisDb) {
  const payloadToPartner = {
    type: "disconnect",
    disconnectedUserId: ws.userId,
  };

  const payloadToSelf = {
    type: "end",
    disconnectedUserId: ws.userId,
  };

  //To inform partner that current user disconnected
  broadcastToRoom(wss, ws, ws.sessionId, JSON.stringify(payloadToPartner));

  //for disconnected user to return back to matching page on all opened tabs
  broadcastToCurrentUser(wss, ws, JSON.stringify(payloadToSelf));

  //Handle local state user deletion
  const room = roomToDocMap.get(ws.sessionId);
  room.users.delete(ws.userId);
  if (room.users.size === 0) {
    logger.info("room is empty");
    room.lastEmptyAt = Date.now();
  }

  //Handle Redis state user deletion
  const key = `session:${ws.sessionId}`;
  const sessionData = await redisDb.hGetAll(key);

  const users = JSON.parse(sessionData.users);
  const updatedUsers = users.filter((u) => u !== ws.userId);
  let lastEmptyAt = sessionData.lastEmptyAt;
  if (updatedUsers.length == 0) {
    lastEmptyAt = String(Date.now());
  }
  await redisDb.hSet(key, {
    users: JSON.stringify(updatedUsers),
    lastEmptyAt: lastEmptyAt,
  });
}

//Handle disconnection for remaining open tabs of one user
function broadcastToCurrentUser(webSocketServer, websocket, update) {
  webSocketServer.clients.forEach((client) => {
    if (
      client !== websocket &&
      client.readyState === WebSocket.OPEN &&
      client.userId === websocket.userId
    ) {
      client.send(update);
    }
  });
}

//Communicate update to other websockets with same roomId
//O(N) time complexity -> think about using hashmap to store sessionId:[socket1, socket2]
function broadcastToRoom(webSocketServer, websocket, sessionId, update) {
  webSocketServer.clients.forEach((client) => {
    if (
      client !== websocket &&
      client.readyState === WebSocket.OPEN &&
      client.sessionId === sessionId
    ) {
      client.send(update);
    }
  });
}

//Checks if message is a cursor update
function parseCursorUpdate(message) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "cursor") {
      return text;
    }
  }
  return null;
}
export {
  parseCursorUpdate,
  handleInitialDocSync,
  broadcastToRoom,
  handleSocketDisconnection,
  handleClientDocSync,
};
