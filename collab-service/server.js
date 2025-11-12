//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2) https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
// for ws framework

import http from "http";
import "dotenv/config";
import app from "./app.js";
import { startDB } from "./db/connection.js";
import { initWebSocketServer } from "./webSocketServer.js";
import logger from "./utils/logger.js";
import { loadAllSessionsFromRedis } from "./utils/sessionDataHandler.js";
import { dbClient } from "./db/connection.js";
import { roomToData } from "./webSocketServer.js";
import jwt from "jsonwebtoken";
import { importJWK, exportSPKI } from "jose";

const port = process.env.PORT;
const server = http.createServer(app);
const webSocketServer = initWebSocketServer();

async function startServer() {
  try {
    await startDB();
    await loadAllSessionsFromRedis(dbClient, roomToData);
    server.listen(port);
    logger.info(`Collab-service-server listening on ${port}`);
  } catch (error) {
    logger.info("Unable to start collab-service server", error);
  }
}

server.on("upgrade", async (request, socket, head) => {
  try {
    const fullUrl = `ws://host${request.url}`;
    const url = new URL(fullUrl);
    const token = url.searchParams.get("token");
    const sessionId = url.searchParams.get("sessionId");
    if (!token) {
      throw new Error("No token provided");
    }
    // Parse the PUBLIC_JWK from environment variable
    const publicJwk = JSON.parse(process.env.PUBLIC_JWK);

    // Import the JWK as a public key object with extractable flag
    const publicKeyObject = await importJWK(publicJwk, publicJwk.alg, {
      extractable: true,
    });

    // Convert to PEM format that jsonwebtoken library expects
    const publicKeyPEM = await exportSPKI(publicKeyObject);
    logger.info("part 3 ");

    // Verify the token using the public key in PEM format
    jwt.verify(
      token,
      publicKeyPEM,
      { algorithms: [publicJwk.alg] },
      (err, decoded) => {
        if (err) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();

          return;
        }
        //Update http to websocket connection if jwt verified
        webSocketServer.handleUpgrade(request, socket, head, (ws) => {
          ws.userId = decoded.id;
          const sessionData = roomToData.get(sessionId);
          if (!sessionData.users.has(decoded.id)) {
            sessionData.users.add(decoded.id);
          }
          webSocketServer.emit("connection", ws, request);
        });
      },
    );
  } catch (error) {
    socket.destroy();
  }
});

startServer();
