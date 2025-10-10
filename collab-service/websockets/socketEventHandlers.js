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
function handleSocketDisconnection(ws, wss) {
  const payload = {
    type: "disconnect",
    disconnectedUserId: ws.userId,
  };
  broadcastToRoom(wss, ws, ws.room, JSON.stringify(payload));
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
    }
  });
}

export {
  getYDoc,
  parseCursorUpdate,
  handleInitialDocSync,
  broadcastToRoom,
  handleSocketDisconnection,
};
