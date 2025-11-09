/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-11-08
 * Purpose: Controllers for handling question attempts endpoints.
 * Author Review: Added validation and error handling, checked correctness.
 */

import {
  addAttemptToDb,
  getAttemptedQuestionsByUserFromDb,
  getAttemptedTopicsByUserFromDb,
  getFavoriteTopicsByUserFromDb,
  getLastAttemptedQuestionByUserFromDb,
  getTotalAttemptsCountByUserFromDb,
  getAttemptsInPastWeekByUserFromDb
} from '../models/attempts.js';

/**
 * Controller to handle POST /questions/attempts
 * Request body:
 *   - question_id: number - The question ID
 *   - user_id: string[] - Array of user IDs (MongoDB ObjectId strings, minimum 1, maximum 2)
 *   - attempted_date: string - Date in YYYY-MM-DD format
 * Returns:
 *   - 201: Attempt(s) created successfully
 *   - 400: Invalid request data
 *   - 500: Server error
 */
export async function createAttempt(req, res) {
  try {
    const { question_id, user_id, attempted_date } = req.body;

    // Validate required fields
    if (!question_id || !user_id || !attempted_date) {
      return res.status(400).json({
        message: 'Missing required fields: question_id, user_id, and attempted_date are required'
      });
    }

    // Validate question_id is a positive integer
    const questionId = parseInt(question_id, 10);
    if (isNaN(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: 'Invalid question_id. Must be a positive integer.'
      });
    }

    // Validate user_id is an array
    if (!Array.isArray(user_id)) {
      return res.status(400).json({
        message: 'user_id must be an array'
      });
    }

    // Validate array length (1-2 users)
    if (user_id.length < 1 || user_id.length > 2) {
      return res.status(400).json({
        message: 'user_id array must contain 1 or 2 user IDs'
      });
    }

    // Validate each user ID is a non-empty string (MongoDB ObjectId format)
    const userIds = [];
    for (const id of user_id) {
      if (typeof id !== 'string' || id.trim().length === 0) {
        return res.status(400).json({
          message: 'All user IDs must be non-empty strings'
        });
      }
      userIds.push(id.trim());
    }

    // Validate attempted_date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(attempted_date)) {
      return res.status(400).json({
        message: 'Invalid attempted_date format. Use YYYY-MM-DD format.'
      });
    }

    // Validate it's a valid date
    const date = new Date(attempted_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        message: 'Invalid attempted_date. Must be a valid date.'
      });
    }

    // Validate date is not in the future
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); 
    if (date > tomorrow) {
      return res.status(400).json({
        message: 'Invalid attempted_date. Date cannot be in the future.'
      });
    }

    // Add attempt to database
    const attempts = await addAttemptToDb(questionId, userIds, attempted_date);

    res.status(201).json({
      message: 'Attempt(s) created successfully',
      data: attempts
    });
  } catch (err) {
    console.error('[ERROR] Failed to create attempt:', err.message);
    res.status(500).json({
      message: 'Failed to create attempt',
      error: err.message
    });
  }
}

/**
 * Controller to handle GET /questions/attempts/users/:user_id
 * Request parameters:
 *   - user_id: The user ID (MongoDB ObjectId string)
 * Returns:
 *   - 200: Object with total_count and array of question IDs sorted in ascending order
 *   - 400: Invalid user ID
 *   - 500: Server error
 */
export async function getUserAttempts(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
      return res.status(400).json({
        message: 'Valid user ID parameter is required'
      });
    }

    const userId = user_id.trim();

    // Get attempted questions from database
    const result = await getAttemptedQuestionsByUserFromDb(userId);

    // Check if user has no attempts
    if (result === null) {
      return res.status(400).json({
        message: `User ID ${userId} has not attempted any questions`
      });
    }

    res.status(200).json({
      data: result
    });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve user attempts:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve user attempts',
      error: err.message
    });
  }
}

/**
 * Controller to handle GET /questions/attempts/:user_id/topics
 * Request parameters:
 *   - user_id: The user ID (MongoDB ObjectId string)
 * Returns:
 *   - 200: Array of objects with topic and attempted_topic_count
 *   - 400: Invalid user ID
 *   - 500: Server error
 */
export async function getUserAttemptedTopics(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
      return res.status(400).json({
        message: 'Valid user ID parameter is required'
      });
    }

    const userId = user_id.trim();

    // Get attempted topics from database
    const topics = await getAttemptedTopicsByUserFromDb(userId);

    // Check if user has no attempts
    if (topics === null) {
      return res.status(400).json({
        message: `User ID ${userId} has not attempted any questions`
      });
    }

    res.status(200).json({
      data: topics
    });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve user attempted topics:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve user attempted topics',
      error: err.message
    });
  }
}

/**
 * Controller to handle GET /questions/attempts/:user_id/favorite-topic
 * Request parameters:
 *   - user_id: The user ID (MongoDB ObjectId string)
 * Returns:
 *   - 200: Array of favorite topic names (topics with highest attempt count)
 *   - 400: Invalid user ID
 *   - 500: Server error
 */
export async function getUserFavoriteTopics(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
      return res.status(400).json({
        message: 'Valid user ID parameter is required'
      });
    }

    const userId = user_id.trim();

    // Get favorite topics from database
    const favoriteTopics = await getFavoriteTopicsByUserFromDb(userId);

    // Check if user has no attempts
    if (favoriteTopics === null) {
      return res.status(400).json({
        message: `User ID ${userId} has not attempted any questions`
      });
    }

    res.status(200).json({
      data: favoriteTopics
    });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve user favorite topics:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve user favorite topics',
      error: err.message
    });
  }
}

/**
 * Controller to handle GET /questions/attempts/:user_id/last
 * Request parameters:
 *   - user_id: The user ID (MongoDB ObjectId string)
 * Returns:
 *   - 200: Object with last attempted question details
 *   - 400: Invalid user ID or no attempts found
 *   - 500: Server error
 */
export async function getLastAttemptedQuestion(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
      return res.status(400).json({
        message: 'Valid user ID parameter is required'
      });
    }

    const userId = user_id.trim();

    // Get last attempted question from database
    const lastAttempt = await getLastAttemptedQuestionByUserFromDb(userId);

    // Check if user has no attempts
    if (lastAttempt === null) {
      return res.status(400).json({
        message: `User ID ${userId} has not attempted any questions`
      });
    }

    res.status(200).json({
      data: lastAttempt
    });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve last attempted question:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve last attempted question',
      error: err.message
    });
  }
}

/**
 * Controller to handle GET /questions/attempts/:user_id/count
 * Request parameters:
 *   - user_id: The user ID (MongoDB ObjectId string)
 * Returns:
 *   - 200: Object with total count of attempted questions
 *   - 400: Invalid user ID
 *   - 500: Server error
 */
export async function getTotalAttemptsCount(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
      return res.status(400).json({
        message: 'Valid user ID parameter is required'
      });
    }

    const userId = user_id.trim();

    // Get total attempts count from database
    const totalCount = await getTotalAttemptsCountByUserFromDb(userId);

    res.status(200).json({
      data: {
        total_count: totalCount
      }
    });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve total attempts count:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve total attempts count',
      error: err.message
    });
  }
}

/**
 * Controller to handle GET /questions/attempts/:user_id/week
 * Request parameters:
 *   - user_id: The user ID (MongoDB ObjectId string)
 * Returns:
 *   - 200: Object with count and array of questions attempted in past 7 days
 *   - 400: Invalid user ID
 *   - 500: Server error
 */
export async function getAttemptsInPastWeek(req, res) {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
      return res.status(400).json({
        message: 'Valid user ID parameter is required'
      });
    }

    const userId = user_id.trim();

    // Get attempts in past week from database
    const weeklyAttempts = await getAttemptsInPastWeekByUserFromDb(userId);

    res.status(200).json({
      data: weeklyAttempts
    });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve weekly attempts:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve weekly attempts',
      error: err.message
    });
  }
}
