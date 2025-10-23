import { SessionModel } from "../models/session-model.js";
// import { dbClient } from "../db/connection.js";
import * as z from "zod";
export async function createSession(req, res) {
  try {
    SessionModel.parse(req.body);
    const { sessionId, user1Id, user2Id, questionDifficulty, questionTopic } =
      req.body;
    //check if sessionId already exists in redis, if exist return session info
    console.log("Getting question from question service..");
    // await dbClient.set(sessionId, "value in redis");

    // const value = await dbClient.get(sessionId);
    const value = "test";
    console.log(value);
    //ADD SESSION TO REDIS TEST

    //temp mock question
    const question = {
      title: "2 sum",
      difficulty: "Easy",
      description: "return indexes of two elements that add up to target",
      input: "target = 5, nums = [1,2,3]",
    };
    res.status(201).json({
      message: `Created new session ${sessionId} successfully`,
      question,
      sessionId,
      value,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
