/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: Claude Sonnet 4.0), date: 2025-11-10
 * Purpose: To implement session creation and retrieval for users who rejoin sessions
 * Author Review: I validated correctness and performance of the code.
 */

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
//Add data to local in memory storage map objects and store sessionData in redis
export async function createSession(req, res) {
  try {
    SessionModel.parse(req.body);
    const { sessionId, user1, user2, criteria } = req.body;
    const redisKey = `session:${sessionId}`;
    let question;
    
    try {
      const questionServiceUrl = process.env.QUESTION_SERVICE_URL;

      const requestBody = {
        difficulty: criteria.difficulty,
        topic: criteria.topics,
        limit: 1,
        random: true,
      };

      const questionResponse = await fetch(
        `${questionServiceUrl}/questions/search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!questionResponse.ok) {
        const errorMessage = await questionResponse.text();
        logger.error(
          `Failed to fetch question: ${questionResponse.status} - ${errorMessage}`
        );
        throw new Error("Failed to fetch question");
      }

      const questionData = await questionResponse.json();
      logger.info(`Question fetched successfully: ${JSON.stringify(questionData)}`);
      
      if (!questionData.data || questionData.data.length === 0) {
        logger.error("No questions match the specified criteria");
        
        // Format the criteria for user-friendly display
        const difficultyText = criteria.difficulty.join(", ");
        const topicsText = criteria.topics.join(", ");
        
        return res.status(404).json({
          error: "No questions match the specified criteria",
          message: `No questions available for the selected criteria: Difficulty [${difficultyText}] and Topics [${topicsText}]`,
          criteria: {
            difficulty: criteria.difficulty,
            topics: criteria.topics
          }
        });
      }

      question = questionData.data[0];
    } catch (err) {
      logger.error("Error in retrieving question for session:", err.message);
      return res.status(500).json({
        error: "Error in retrieving question for session",
        details: err.message,
      });
    }

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
    await delay(3000);
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

//Get session details including question for reconnection
export async function getSessionDetails(req, res) {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    // Check if session exists in memory first
    let sessionData = roomToData.get(sessionId);
    
    if (!sessionData) {
      // Try to load from Redis if not in memory
      const redisKey = `session:${sessionId}`;
      const redisData = await dbClient.hGetAll(redisKey);
      
      if (!redisData || !redisData.doc) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      sessionData = {
        questionId: redisData.questionId || null,
      };
    }

    if (!sessionData.questionId) {
      return res.status(404).json({ error: "Question not found in session" });
    }

    // Fetch question details from question service
    try {
      const questionServiceUrl = process.env.QUESTION_SERVICE_URL;
      const questionResponse = await fetch(
        `${questionServiceUrl}/questions/${sessionData.questionId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!questionResponse.ok) {
        const errorMessage = await questionResponse.text();
        logger.error(
          `Failed to fetch question: ${questionResponse.status} - ${errorMessage}`
        );
        throw new Error("Failed to fetch question");
      }

      const questionData = await questionResponse.json();
      
      res.status(200).json({
        sessionId,
        question: questionData.data,
        message: "Session details retrieved successfully",
      });
    } catch (err) {
      logger.error("Error retrieving question for session:", err.message);
      return res.status(500).json({
        error: "Error retrieving question for session",
        details: err.message,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Internal server error, unable to retrieve session details" 
    });
  }
}
