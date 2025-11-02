/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-10-29
 * Purpose: To understand how to to use redis hash to store session data and load session data
 * Author Review: I validated correctness, security, and performance of the code and modified the code to fit use case
 */

import * as Y from "yjs";
import logger from "./logger.js";

//Convert redis session data to local data
function convertDataFromDB(redisData) {
  const doc = new Y.Doc();
  const update = Buffer.from(redisData.doc, "base64");

  Y.applyUpdate(doc, update);
  const users = new Set(JSON.parse(redisData.users || "[]"));
  const lastEmptyAt = redisData.lastEmptyAt
    ? Number(redisData.lastEmptyAt)
    : null;

  const lastSavedAt = redisData.lastSavedAt
    ? Number(redisData.lastEmptyAt)
    : null;

  const sessionData = {
    doc: doc,
    users: users,
    lastEmptyAt: lastEmptyAt,
    lastSavedAt: lastSavedAt,
  };
  return sessionData;
}

//Convert local data to redis data
function convertDataFromLocal(sessionData) {
  const doc = sessionData.doc;
  const docState = Y.encodeStateAsUpdate(doc);
  const docStateAsString = Buffer.from(docState).toString("base64");

  const usersArrayStr = JSON.stringify(Array.from(sessionData.users));
  const lastEmptyAtStr = sessionData.lastEmptyAt
    ? String(sessionData.lastEmptyAt)
    : "";

  const lastSavedAtStr = sessionData.lastSavedAt
    ? String(sessionData.lastSavedAt)
    : "";

  return {
    doc: docStateAsString,
    users: usersArrayStr,
    lastEmptyAt: lastEmptyAtStr,
    lastSavedAtStr: lastSavedAtStr,
  };
}

// Store data as redis hash, where ydoc is saved as anencoded state in base64 string
// users hashset is stored as a a json array and lastEmptyAt is a string
async function saveLocalState(key, redisDb, sessionData) {
  const convertedData = convertDataFromLocal(sessionData);
  await redisDb.hSet(key, convertedData);
}
saveLocalState;

//Populate local memory with redis data
async function loadAllSessionsFromRedis(redisDb, roomToData) {
  logger.info("Loading session states from Redis into memory");

  const keys = await redisDb.keys("session:*");
  if (keys.length === 0) {
    return;
  }

  for (const key of keys) {
    try {
      const redisData = await redisDb.hGetAll(key);
      if (!redisData) continue;

      const sessionId = key.split(":")[1];

      const localSessionData = convertDataFromDB(redisData);
      roomToData.set(sessionId, localSessionData);
    } catch (err) {
      logger.error(`Failed to load ${key} from Redis:`, err);
    }
  }

  logger.info(`Loaded ${roomToData.size} sessions from Redis.`);
}

export {
  saveLocalState,
  convertDataFromDB,
  convertDataFromLocal,
  loadAllSessionsFromRedis,
};
