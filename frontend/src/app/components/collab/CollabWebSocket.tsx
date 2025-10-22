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
import {
  initEditor,
  sendEditorState,
  onCursorChangeHandler,
  onEditorChangeHandler,
  onPartnerCursorChangeHandler,
} from "../../../services/editorSyncHandlers";
import { createInlineStyle } from "@/lib/utils";

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
  userName: string
) {
  editorInstance.onDidChangeCursorSelection((event) =>
    onCursorChangeHandler(cursorCollections, event, clientWS, userId, userName)
  );
}

//Initialises browser Websocket events
function initialiseCollabWebsocket(
  userId: string,
  sessionId: string,
  ydoc: Y.Doc,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  onLeaveSession: () => void
) {
  const wsBaseUrl =
    process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost/collab-socket";

  const clientWS: ReconnectingWebSocket = new ReconnectingWebSocket(
    `${wsBaseUrl}/${userId}/${sessionId}`
  );

  clientWS.binaryType = "arraybuffer";

  clientWS.onopen = () => {
    initEditor(userId, cursorCollections, editorInstance);
    sendEditorState(userId, ydoc, clientWS);
  };

  //Listens for two types of messages: JSON(for Partner cursor update and initial ydoc sync) and Uint8 array(ydoc updates from partner)
  clientWS.onmessage = (messageEvent) => {
    if (typeof messageEvent.data === "string") {
      const payloadObject = JSON.parse(messageEvent.data);

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
        return;
      } else if (payloadObject.type === "disconnect") {
        const disconnectedUser: string = payloadObject.disconnectedUserId;
        const cursorDecorator: monaco.editor.IEditorDecorationsCollection =
          cursorCollections[disconnectedUser];
        if (cursorDecorator) {
          cursorDecorator.clear();
        }
        delete cursorCollections[disconnectedUser];
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

  clientWS.onclose = () => {
    const cursorDecorator: monaco.editor.IEditorDecorationsCollection =
      cursorCollections[userId];
    if (cursorDecorator) {
      cursorDecorator.clear();
    }
    delete cursorCollections[userId];
  };
  return clientWS;
}

export {
  initialiseCollabWebsocket,
  registerCursorUpdateHandler,
  registerEditorUpdateHandler,
};
