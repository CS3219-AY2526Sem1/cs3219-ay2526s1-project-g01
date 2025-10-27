/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT, date: 2025-10-20
 * Purpose: To query for all questions by topic and difficulty with optional limit and randomization.
 * Author Review: I checked correctness and performance of the code.
 */

import pool from '../db.js';

export async function getAllQuestionsFromDb({ topics, difficulties, limit, random }) {
  try {
    let query = `
      SELECT 
        q.id,
        q.title,
        q.difficulty,
        q.description,
        q.question_constraints,
        -- Aggregate all topics
        COALESCE(
          (
            SELECT JSON_AGG(JSON_BUILD_OBJECT('id', t.id, 'topic', t.name))
            FROM question_topics qt
            JOIN topics t ON qt.topic_id = t.id
            WHERE qt.question_id = q.id
          ), '[]'
        ) AS topics,
        -- Aggregate all test cases in order
        COALESCE(
          (
            SELECT JSON_AGG(JSON_BUILD_OBJECT('index', tc.index, 'input', tc.input, 'output', tc.output) 
                            ORDER BY tc.index ASC)
            FROM test_cases tc
            WHERE tc.question_id = q.id
          ), '[]'
        ) AS test_cases
      FROM questions q
    `;

    const conditions = [];
    const values = [];

    if (difficulties && difficulties.length > 0) {
      conditions.push(`q.difficulty = ANY($${values.length + 1})`);
      values.push(difficulties);
    }

    if (topics && topics.length > 0) {
      conditions.push(`
        EXISTS (
          SELECT 1 
          FROM question_topics qt
          JOIN topics t ON qt.topic_id = t.id
          WHERE qt.question_id = q.id AND LOWER(t.name) = ANY($${values.length + 1})
        )
      `);
      values.push(topics);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (random) {
      query += ' ORDER BY RANDOM()';
    } else {
      query += ' ORDER BY q.id ASC';
    }

    if (limit) {
      query += ` LIMIT $${values.length + 1}`;
      values.push(limit);
    }

    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('[ERROR] getAllQuestionsFromDb:', err.message);
    throw err;
  }
}

