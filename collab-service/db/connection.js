import { createClient } from "redis";
import "dotenv/config";
import logger from "../utils/logger.js";

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_DB = process.env.REDIS_DB;
const REDIS_PORT = process.env.REDIS_PORT;

const dbClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  database: REDIS_DB,
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
