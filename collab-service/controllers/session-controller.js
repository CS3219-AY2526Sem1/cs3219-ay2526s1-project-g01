import { SessionModel } from "../models/session-model.js";
import { dbClient } from "../db/connection.js";
import { roomToData, userToRoom } from "../webSocketServer.js";
import { saveLocalState } from "../utils/sessionDataHandler.js";
import * as z from "zod";
import * as Y from "yjs";
import logger from "../utils/logger.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// //Store session to sessionData on hashmap on WebSocketServer for each room and save data in redis
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

export async function createSession(req, res) {
  try {
    SessionModel.parse(req.body);
    const { sessionId, user1, user2, criteria } = req.body;
    const redisKey = `session:${sessionId}`;

    //CALL QUESTION SERVICE ENDPOINT based on criteria  TO GET QUESTION
    //store questionId retrieve in redis and local map object to reduce memory usage
    //Dummy question object with some fields
    const question = {
      Title: "two sum",
      description: "adasdasdkadjakdaskldajsdlkasdlkakdasd",
      id: "123",
    };

    const sessionData = {
      doc: new Y.Doc(),
      users: new Set([user1.userId, user2.userId]),
      lastEmptyAt: null,
      lastSavedAt: Date.now(),
      questionId: question.id,
    };
    userToRoom.set(user1.userId, { sessionId, partner: user2.userId });
    userToRoom.set(user2.userId, { sessionId, partner: user1.userId });
    for (const [userId, value] of userToRoom.entries()) {
      logger.info("entry in userToRoom");
      logger.info(
        `userId:, ${userId}, value.partner: ${value.partner} and value.sessionId ${value.sessionId}`
      );
    }

    roomToData.set(sessionId, sessionData);
    await saveLocalState(redisKey, dbClient, sessionData);
    await delay(5000);
    res.status(201).json({
      message: `Created new session ${sessionId} successfully`,
      question,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error, unable to create session" });
  }
}
