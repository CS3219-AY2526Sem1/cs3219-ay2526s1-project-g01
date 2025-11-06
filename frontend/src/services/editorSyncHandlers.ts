/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-10-06
 * Purpose: To understand how to track and send cursor information between users
 * Author Review: I validated correctness, security, and performance of the method suggested and modified areas such as
 * uing createDecorationsCollection instead of deltaDecorations suggested by the model
 */

// With Reference to https://stackoverflow.com/questions/68453051/decode-a-uint8array-into-a-json for uint8array to string conversion

import * as Y from "yjs";
import * as monaco from "monaco-editor";
import ReconnectingWebSocket from "reconnecting-websocket";
import { createInlineStyle } from "@/lib/utils";
import { editorWebSocketManager } from "./editorSocketManager";
import { toast } from "sonner";

interface BasePayload {
  type: string;
  userId: string;
}

interface CursorSelection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

interface CursorUpdatePayload extends BasePayload {
  type: "cursor";
  selection: CursorSelection;
}

interface editorSyncPayload extends BasePayload {
  type: "sync";
  ydocState: string;
}

//Partner's cursor CSS
createInlineStyle(
  "remote-cursor",
  "border-left: 2px solid rgba(255, 64, 11, 1);"
);
//Current user's cursor CSS
createInlineStyle(
  "local-cursor",
  "border-left: 2px solid rgba(46, 216, 246, 1)"
);

//Handle updates made to monaco editor by current user
function registerEditorUpdateHandler(
  ydoc: Y.Doc,
  clientWS: ReconnectingWebSocket
) {
  console.log("registerEditorUpdateHandler called at least");
  ydoc.on("update", (update: Uint8Array, origin: string) =>
    onEditorChangeHandler(update, origin, clientWS)
  );
}

//Handle updates made to current user's cursor
function registerCursorUpdateHandler(
  userId: string,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  clientWS: ReconnectingWebSocket,
  userName: string,
  isConnected: boolean
) {
  editorInstance.onDidChangeCursorSelection((event) =>
    onCursorChangeHandler(
      cursorCollections,
      event,
      clientWS,
      userId,
      userName,
      editorInstance,
      isConnected
    )
  );
}

//Initialises browser Websocket events
function configureCollabWebsocket(
  userId: string,
  ydoc: Y.Doc,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  clientWS: ReconnectingWebSocket,
  onLeaveSession: () => void,
  onPartnerLeaveSession: () => void,
  onCloseConnection: () => void
) {
  clientWS.onmessage = (messageEvent) => {
    if (typeof messageEvent.data === "string") {
      const payloadObject = JSON.parse(messageEvent.data);
      if (payloadObject.type === "ping") {
        editorWebSocketManager.setTime();
        return;
      }
      if (payloadObject.type === "cursor" && payloadObject.userId !== userId) {
        onPartnerCursorChangeHandler(
          messageEvent,
          editorInstance,
          cursorCollections
        );
        return;
      } else if (payloadObject.type === "sync") {
        const yUpdate: Uint8Array = Buffer.from(
          payloadObject.ydocUpdate,
          "base64"
        );

        Y.applyUpdate(ydoc, yUpdate, "remote");
        console.log("applied update from remote for sync packet");
        return;
      } else if (payloadObject.type === "sync_client") {
        const initialServerState = Buffer.from(
          payloadObject.ydocState,
          "base64"
        );
        const serverMissingDiff = Y.encodeStateAsUpdate(
          ydoc,
          initialServerState
        );

        const updateAsString =
          Buffer.from(serverMissingDiff).toString("base64");
        const update_payload = {
          type: "sync_client",
          ydocUpdate: updateAsString,
        };
        clientWS.send(JSON.stringify(update_payload));
        return;
      } else if (payloadObject.type === "disconnect") {
        const disconnectedUser: string = payloadObject.disconnectedUserId;
        console.log(disconnectedUser);
        const cursorDecorator: monaco.editor.IEditorDecorationsCollection =
          cursorCollections[disconnectedUser];
        if (cursorDecorator) {
          cursorDecorator.clear();
        }
        delete cursorCollections[disconnectedUser];
        onPartnerLeaveSession();
      } else if (payloadObject.type === "end") {
        onLeaveSession();
      }
      //bufferArray Type
    } else {
      const yUpdate: Uint8Array = new Uint8Array(messageEvent.data);
      Y.applyUpdate(ydoc, yUpdate, "remote");
    }
  };

  clientWS.onerror = (error) => {
    console.log(error);
  };

  const heartBeat = setInterval(() => {
    if (Date.now() - editorWebSocketManager.getTime() > 10000) {
      console.warn(
        "frontend socket not receiving ping from server, reconnecting socket"
      );
      toast.warning("You are now offline. Please reconnect to the wifi");
      for (const [id, decorator] of Object.entries(cursorCollections)) {
        if (decorator) {
          console.log(`id deleted is ${id}`);
          decorator.clear();
          delete cursorCollections[id];
        }
      }
      onCloseConnection();
      clientWS.reconnect();
      console.log("set isConnect to false by heartBEAT, reconnect called");
    } else {
      console.log("frontend socket still alive");
    }
  }, 5000);
  clientWS.onclose = () => {
    // const cursorDecorator: monaco.editor.IEditorDecorationsCollection =
    //   cursorCollections[userId];
    // if (cursorDecorator) {
    //   cursorDecorator.clear();
    // }
    // // delete cursorCollections[userId];
    onCloseConnection();
    console.log("set isConnect to false");
    clearInterval(heartBeat);
  };
}

//Set up initial cursor position as a decoration.
function initEditor(
  userId: string,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  editorInstance: monaco.editor.IStandaloneCodeEditor
) {
  cursorCollections[userId] = editorInstance.createDecorationsCollection([]);

  cursorCollections[userId].set([
    {
      range: new monaco.Range(1, 1, 1, 1),
      options: {
        className: "local-cursor",
        hoverMessage: { value: `User ${userId}` },
      },
    },
  ]);
  console.log("Add user cursor decorator");
}

//Send initial editor state to backend socket
function sendEditorState(
  userId: string,
  ydoc: Y.Doc,
  ws: ReconnectingWebSocket
) {
  console.log("sent editor state");
  // const initialState: Uint8Array = Y.encodeStateVector(ydoc);
  const initialState: Uint8Array = Y.encodeStateVector(ydoc);

  const stateAsString: string = Buffer.from(initialState).toString("base64");

  const payload: editorSyncPayload = {
    type: "sync",
    userId: userId,
    ydocState: stateAsString,
  };

  ws.send(JSON.stringify(payload));
}

//Send changes made on local code editor to backend socket
function onEditorChangeHandler(
  update: Uint8Array,
  origin: string,
  clientWS: ReconnectingWebSocket
) {
  console.log("onEditorChangeHandler called");
  console.log(clientWS.readyState === WebSocket.OPEN);
  if (origin != "remote" && clientWS.readyState === WebSocket.OPEN) {
    console.log("client sends ydoc update to server");
    clientWS.send(update);
  }
}

//Send changes made to local cursor to backend socket and update local cursor decoration
function onCursorChangeHandler(
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  event: monaco.editor.ICursorSelectionChangedEvent,
  clientWS: ReconnectingWebSocket,
  userId: string,
  userName: string,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  isConnected: boolean
) {
  if (!isConnected) {
    return;
  }
  const { startLineNumber, startColumn, endLineNumber, endColumn } =
    event.selection;
  if (clientWS.readyState === WebSocket.OPEN) {
    const cursorUpdate: CursorUpdatePayload = {
      type: "cursor",
      userId: userId,
      selection: {
        startLineNumber: startLineNumber,
        startColumn: startColumn,
        endLineNumber: endLineNumber,
        endColumn: endColumn,
      },
    };
    clientWS.send(JSON.stringify(cursorUpdate));
  }
  if (!cursorCollections[userId]) {
    cursorCollections[userId] = editorInstance.createDecorationsCollection([]);
  }
  cursorCollections[userId].set([
    {
      range: new monaco.Range(
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn
      ),
      options: {
        className: "local-cursor",
        hoverMessage: { value: `User ${userName}` },
      },
    },
  ]);
}

//Receives partner cursor positions and set partner cursor decoration
function onPartnerCursorChangeHandler(
  messageEvent: MessageEvent,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>
) {
  const data: CursorUpdatePayload = JSON.parse(messageEvent.data);

  if (data.type === "cursor") {
    if (!cursorCollections[data.userId]) {
      cursorCollections[data.userId] =
        editorInstance.createDecorationsCollection([]);
    }
    const { startLineNumber, startColumn, endLineNumber, endColumn } =
      data.selection;
    cursorCollections[data.userId].set([
      {
        range: new monaco.Range(
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn
        ),
        options: {
          className: "remote-cursor",
          hoverMessage: { value: `User ${data.userId}` },
        },
      },
    ]);
  }
}

export {
  configureCollabWebsocket,
  initEditor,
  sendEditorState,
  registerCursorUpdateHandler,
  registerEditorUpdateHandler,
};
