import WebSocket from "ws";
import * as Y from "yjs";
import logger from "../utils/logger.js";

//Store session to sessionData on hashmap on WebSocketServer for each room and save data in redis
// async function handleSocketConnection(
//   redisDb,
//   userId,
//   sessionId,
//   roomToDataMap
// ) {
//   const key = `session:${sessionId}`;

//   let sessionData = roomToDataMap.get(sessionId);
//   if (!sessionData) {
//     const redisData = await redisDb.hGetAll(key);
//     // Case where session crated but server crashed so sessionData only exists in redis so form local sesionData from redis
//     if (Object.keys(redisData).length > 0) {
//       sessionData = convertDataFromDB(redisData);
//       // Case where its a brand new session
//     } else {
//       sessionData = {
//         doc: new Y.Doc(),
//         users: new Set(),
//         lastEmptyAt: null,
//         lastSavedAt: Date.now(),
//       };
//     }
//     roomToDataMap.set(sessionId, sessionData);
//   }

//   sessionData.users.add(userId);
//   sessionData.lastEmptyAt = null;
//   await saveLocalState(key, redisDb, sessionData);
// }

//Handles syncing of code editor with most updated changes by sending the difference to client
function handleInitialDocSync(message, ws, ydoc, wss, sessionId) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "sync") {
      const initialState = Buffer.from(data.ydocState, "base64");
      const update = Y.encodeStateAsUpdate(ydoc, initialState);
      Y.applyUpdate(ydoc, update);

      broadcastToRoom(wss, ws, sessionId, update);
      const updateAsString = Buffer.from(update).toString("base64");
      const payload = {
        type: "sync",
        ydocUpdate: updateAsString,
      };
      ws.send(JSON.stringify(payload));
      return true;
    }
  }
  return false;
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
};
