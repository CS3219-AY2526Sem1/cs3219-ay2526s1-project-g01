/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-09-23
 * Purpose: To understand how to implement heart-beat mechanism and prevent socket timeout
 * Author Review: I validated correctness, security, and performance of the code and modified the code to fit use case
 *
 */
import * as Y from "yjs";

export default function socketCommunication(
  userId: string,
  sessionId: string,
  ydoc: Y.Doc,
) {
  const clientWS: WebSocket = new WebSocket(
    `ws://localhost/collab-socket/${userId}/${sessionId}`,
  );

  clientWS.binaryType = "arraybuffer";

  clientWS.onopen = () => {
    console.log("Connected to server Websocket Succesfully");
  };

  const heartBeat = setInterval(() => {
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.send("ping");
    }
  }, 30000);

  ydoc.on("update", (update: Uint8Array, origin) => {
    if (origin != "remote" && clientWS.readyState === WebSocket.OPEN) {
      clientWS.send(update);
    }
  });

  clientWS.onmessage = (messageEvent) => {
    if (typeof messageEvent.data === "string" && messageEvent.data === "pong") {
      console.log("Recevied pong");
      return;
    }
    const yUpdate: Uint8Array = new Uint8Array(messageEvent.data);
    Y.applyUpdate(ydoc, yUpdate, "remote");
  };

  clientWS.onclose = () => clearInterval(heartBeat);

  clientWS.onerror = (error) => {
    console.log(error);
  };
  return clientWS;
}
