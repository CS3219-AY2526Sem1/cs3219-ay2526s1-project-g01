import { createClient } from "redis";
import "dotenv/config";
import logger from "../utils/logger.js";

const dbClient = createClient({
  url: process.env.REDIS_HOST || "redis://redis-collab-service:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("[REDIS] Max reconnection attempts reached");
        return new Error("Max reconnection attempts reached");
      }
      const delay = Math.min(retries * 100, 3000);
      console.log(`[REDIS] Reconnecting in ${delay}ms... (attempt ${retries})`);
      return delay;
    },
    connectTimeout: 10000,
  },
});

dbClient.on("error", (err) => console.log("Redis Client Error", err));

async function startDB() {
  if (!dbClient.isOpen) {
    await dbClient.connect();
    logger.info("Redis db connected");
  }
}

async function endDB() {
  if (dbClient.isOpen) {
    await dbClient.quit();
    console.log("Redis db disconnected");
  }
}

export { dbClient, startDB, endDB };
