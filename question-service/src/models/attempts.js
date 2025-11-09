/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-11-08
 * Purpose: Database operations for question attempts tracking.
 * Author Review: Checked correctness and performance of the code.
 */

import pool from '../db.js';

/**
 * Helper function to format topic names:
 * - Capitalizes first letter of each word
 * - Trims trailing and leading spaces
 * @param {string} topic - The topic name to format
 * @returns {string} Formatted topic name
 */
function formatTopicName(topic) {
  return topic
    .trim() // Remove leading and trailing spaces
    .split(' ') // Split by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(' '); // Join back with spaces
}

/**
 * Add a new attempt record to the database
 * If the user has already attempted this question, update the attempted_date to the latest date
 * @param {number} questionId - The ID of the question attempted
 * @param {string[]} userIds - Array of user IDs (MongoDB ObjectId strings)
 * @param {string} attemptedDate - The date of the attempt (YYYY-MM-DD format)
 * @returns {Promise<Object[]>} Array of created/updated attempt records
 */
export async function addAttemptToDb(questionId, userIds, attemptedDate) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const insertedAttempts = [];
    
    // Insert one record for each user, or update if already exists
    for (const userId of userIds) {
      const query = `
        INSERT INTO attempts (question_id, user_id, attempted_date)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, question_id) 
        DO UPDATE SET attempted_date = EXCLUDED.attempted_date
        RETURNING id, question_id, user_id, attempted_date
      `;
      
      const { rows } = await client.query(query, [questionId, userId, attemptedDate]);
      insertedAttempts.push(rows[0]);
    }
    
    await client.query('COMMIT');
    return insertedAttempts;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ERROR] addAttemptToDb:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get all question IDs attempted by a specific user, sorted, with total count
 * @param {string} userId - The user ID (MongoDB ObjectId string)
 * @returns {Promise<Object|null>} Object with total_count and array of question IDs sorted in ascending order, or null if no attempts found
 */
export async function getAttemptedQuestionsByUserFromDb(userId) {
  try {
    const query = `
      SELECT DISTINCT question_id
      FROM attempts
      WHERE user_id = $1
      ORDER BY question_id ASC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    
    // Return null if no attempts found
    if (rows.length === 0) {
      return null;
    }
    
    const questionIds = rows.map(row => row.question_id);
    
    return {
      total_count: questionIds.length,
      question_ids: questionIds
    };
  } catch (err) {
    console.error('[ERROR] getAttemptedQuestionsByUserFromDb:', err.message);
    throw err;
  }
}

/**
 * Get topics and their attempt counts for a specific user
 * @param {string} userId - The user ID (MongoDB ObjectId string)
 * @returns {Promise<Object[]|null>} Array of objects with topic and attempted_topic_count, or null if no attempts found
 */
export async function getAttemptedTopicsByUserFromDb(userId) {
  try {
    const query = `
      SELECT 
        t.name as topic,
        COUNT(DISTINCT a.question_id) as attempted_topic_count
      FROM attempts a
      JOIN question_topics qt ON a.question_id = qt.question_id
      JOIN topics t ON qt.topic_id = t.id
      WHERE a.user_id = $1
      GROUP BY t.name
      ORDER BY attempted_topic_count DESC, t.name ASC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    
    // Return null if no attempts found
    if (rows.length === 0) {
      return null;
    }
    
    return rows.map(row => ({
      topic: formatTopicName(row.topic),
      attempted_topic_count: parseInt(row.attempted_topic_count, 10)
    }));
  } catch (err) {
    console.error('[ERROR] getAttemptedTopicsByUserFromDb:', err.message);
    throw err;
  }
}

/**
 * Get the favorite topic(s) for a specific user (topics with highest attempt count)
 * @param {string} userId - The user ID (MongoDB ObjectId string)
 * @returns {Promise<string[]|null>} Array of topic names with the highest attempt count, or null if no attempts found
 */
export async function getFavoriteTopicsByUserFromDb(userId) {
  try {
    const query = `
      WITH topic_counts AS (
        SELECT 
          t.name as topic,
          COUNT(DISTINCT a.question_id) as attempted_topic_count
        FROM attempts a
        JOIN question_topics qt ON a.question_id = qt.question_id
        JOIN topics t ON qt.topic_id = t.id
        WHERE a.user_id = $1
        GROUP BY t.name
      )
      SELECT topic
      FROM topic_counts
      WHERE attempted_topic_count = (SELECT MAX(attempted_topic_count) FROM topic_counts)
      ORDER BY topic ASC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    
    // Return null if no attempts found
    if (rows.length === 0) {
      return null;
    }
    
    return rows.map(row => formatTopicName(row.topic));
  } catch (err) {
    console.error('[ERROR] getFavoriteTopicsByUserFromDb:', err.message);
    throw err;
  }
}

/**
 * Get the last N attempted questions for a specific user
 * @param {string} userId - The user ID (MongoDB ObjectId string)
 * @param {number} limit - Number of recent attempts to retrieve (default: 3)
 * @returns {Promise<Object[]>} Array of recent attempt objects with question details
 */
export async function getRecentAttemptsbyUserFromDb(userId, limit = 3) {
  try {
    const query = `
      SELECT 
        a.question_id,
        a.attempted_date,
        q.title,
        q.difficulty,
        COALESCE(
          (
            SELECT JSON_AGG(t.name)
            FROM question_topics qt
            JOIN topics t ON qt.topic_id = t.id
            WHERE qt.question_id = q.id
          ), '[]'
        ) AS topics
      FROM attempts a
      JOIN questions q ON a.question_id = q.id
      WHERE a.user_id = $1
      ORDER BY a.attempted_date DESC, a.id DESC
      LIMIT $2
    `;
    
    const { rows } = await pool.query(query, [userId, limit]);
    
    return rows.map(row => ({
      question_id: row.question_id,
      title: row.title,
      difficulty: row.difficulty,
      topics: row.topics,
      attempted_date: row.attempted_date
    }));
  } catch (err) {
    console.error('[ERROR] getRecentAttemptsbyUserFromDb:', err.message);
    throw err;
  }
}

/**
 * Get the total count of distinct questions attempted by a user
 * @param {string} userId - The user ID (MongoDB ObjectId string)
 * @returns {Promise<number>} Total count of attempted questions
 */
export async function getTotalAttemptsCountByUserFromDb(userId) {
  try {
    const query = `
      SELECT COUNT(DISTINCT question_id) as total_count
      FROM attempts
      WHERE user_id = $1
    `;
    
    const { rows } = await pool.query(query, [userId]);
    return rows[0] ? parseInt(rows[0].total_count, 10) : 0;
  } catch (err) {
    console.error('[ERROR] getTotalAttemptsCountByUserFromDb:', err.message);
    throw err;
  }
}

/**
 * Get questions attempted in the past 7 days by a user
 * @param {string} userId - The user ID (MongoDB ObjectId string)
 * @returns {Promise<Object>} Object with count and array of questions
 */
export async function getAttemptsInPastWeekByUserFromDb(userId) {
  try {
    const query = `
      WITH weekly_attempts AS (
        SELECT DISTINCT
          a.question_id,
          q.title,
          q.difficulty,
          a.attempted_date
        FROM attempts a
        JOIN questions q ON a.question_id = q.id
        WHERE a.user_id = $1
          AND a.attempted_date >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY a.attempted_date DESC, a.question_id DESC
      )
      SELECT 
        COUNT(*) as count,
        COALESCE(
          JSON_AGG(JSON_BUILD_OBJECT(
            'question_id', question_id,
            'title', title,
            'difficulty', difficulty,
            'attempted_date', attempted_date
          )),
          '[]'
        ) as questions
      FROM weekly_attempts
    `;
    
    const { rows } = await pool.query(query, [userId]);
    
    if (rows.length === 0 || rows[0].count === 0) {
      return {
        count: 0,
        questions: []
      };
    }
    
    return {
      count: parseInt(rows[0].count, 10),
      questions: rows[0].questions || []
    };
  } catch (err) {
    console.error('[ERROR] getAttemptsInPastWeekByUserFromDb:', err.message);
    throw err;
  }
}
