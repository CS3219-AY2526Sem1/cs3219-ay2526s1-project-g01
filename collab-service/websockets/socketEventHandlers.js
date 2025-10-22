import WebSocket from "ws";
import * as Y from "yjs";
import logger from "../utils/logger.js";

//Create ydoc on WebSocketServer for each room and initilise room data
function handleSocketConnection(roomToDocMap, userId, roomId) {
  let room = roomToDocMap.get(roomId);
  if (!room) {
    room = { doc: new Y.Doc(), users: new Set(), lastEmptyAt: null };
    roomToDocMap.set(roomId, room);
  }
  room.users.add(userId);
  room.lastEmptyAt = null;
}

//Handles syncing of code editor with most updated changes by sending the difference to client
function handleInitialDocSync(message, ws, ydoc) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "sync") {
      const initialState = Buffer.from(data.ydocState, "base64");
      const update = Y.encodeStateAsUpdate(ydoc, initialState);
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
function handleSocketDisconnection(ws, wss, roomToDocMap) {
  const payloadToPartner = {
    type: "disconnect",
    disconnectedUserId: ws.userId,
  };

  const payloadToSelf = {
    type: "end",
    disconnectedUserId: ws.userId,
  };

  //To inform partner that current user disconnected
  broadcastToRoom(wss, ws, ws.room, JSON.stringify(payloadToPartner));

  //for disconnected user to return back to matching page on all opened tabs
  broadcastToCurrentUser(wss, ws, JSON.stringify(payloadToSelf));

  //Handle state deletion
  const room = roomToDocMap.get(ws.room);
  room.users.delete(ws.userId);
  if (room.users.size === 0) {
    room.lastEmptyAt = Date.now();
  }
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
function broadcastToRoom(webSocketServer, websocket, roomId, update) {
  webSocketServer.clients.forEach((client) => {
    if (
      client !== websocket &&
      client.readyState === WebSocket.OPEN &&
      client.room === roomId
    ) {
      client.send(update);
      hasUserInRoom = true;
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
  handleSocketConnection,
};
