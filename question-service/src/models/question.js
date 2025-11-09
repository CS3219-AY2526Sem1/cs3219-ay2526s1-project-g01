/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT, date: 2025-10-20
 * Purpose: Database operations for questions including retrieval and creation.
 * Author Review: I checked correctness and performance of the code.
 */

/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (Claude Sonnet 3.5), date: 2025-10-29
 * Purpose: To implement functions for CRUD operations on questions.
 * Author Review: I modified to add validation and error handling, checked correctness and performance of the code.
 */

/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (Claude Sonnet 4.5), date: 2025-11-10
 * Purpose: To fix a bug in the sequence handling when deleting questions, and to improve performance of question retrieval.
 * Author Review: I validated the correctness and performance of the code.
 */

import pool from '../db.js';


export async function getQuestionsByIdsFromDb(ids) {
  try {
    const query = `
      SELECT 
        q.id,
        q.title,
        q.difficulty,
        q.description,
        q.question_constraints,
        -- Get topics as an array
        COALESCE(
          (
            SELECT JSON_AGG(t.name)
            FROM question_topics qt
            JOIN topics t ON qt.topic_id = t.id
            WHERE qt.question_id = q.id
          ), '[]'
        ) AS topics,
        -- Get test cases as an array of objects with input and output
        COALESCE(
          (
            SELECT JSON_AGG(JSON_BUILD_OBJECT('input', tc.input, 'output', tc.output) ORDER BY tc.index)
            FROM test_cases tc
            WHERE tc.question_id = q.id
          ), '[]'
        ) AS test_cases
      FROM questions q
      WHERE q.id = ANY($1)
      ORDER BY q.id
    `;

    const { rows } = await pool.query(query, [ids]);
    return rows;
  } catch (err) {
    console.error('[ERROR] getQuestionsByIdsFromDb:', err.message);
    throw err;
  }
}


export async function getAllQuestionsFromDb({ topics, difficulties, limit, random }) {
  try {
    // Set default limit to 3 if not specified
    if (limit === undefined || limit === null) {
      limit = 3;
    }

    // Step 1: Get all matching question IDs efficiently (no heavy joins)
    let idQuery = 'SELECT q.id FROM questions q';
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
      idQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // Always order by ID for consistent results when not random
    idQuery += ' ORDER BY q.id ASC';

    const { rows: idRows } = await pool.query(idQuery, values);
    let questionIds = idRows.map(row => row.id);

    // Step 2: If random is requested, shuffle the IDs in JavaScript (much faster than DB ORDER BY RANDOM)
    if (random) {
      // Fisher-Yates shuffle algorithm for efficient randomization
      for (let i = questionIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionIds[i], questionIds[j]] = [questionIds[j], questionIds[i]];
      }
    }

    // Step 3: Apply limit to the (possibly shuffled) IDs
    if (limit && limit < questionIds.length) {
      questionIds = questionIds.slice(0, limit);
    }

    // Step 4: If no IDs match, return empty array
    if (questionIds.length === 0) {
      return [];
    }

    // Step 5: Get full question data for the selected IDs using existing optimized function
    const questions = await getQuestionsByIdsFromDb(questionIds);

    // Step 6: If random was requested, the order is already randomized by the shuffled IDs
    // If not random, we want to maintain the original ID order
    if (!random) {
      // Sort by ID to maintain consistent ordering
      questions.sort((a, b) => a.id - b.id);
    }

    return questions;
  } catch (err) {
    console.error('[ERROR] getAllQuestionsFromDb:', err.message);
    throw err;
  }
}


export async function updateQuestionInDb({ id, title, difficulty, description, question_constraints, topics, test_cases }) {
  const client = await pool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');

    // Verify all provided topics exist
    const loweredTopics = topics.map(t => t.toLowerCase());
    const { rows: existingTopics } = await client.query(
      `SELECT id, LOWER(name) AS name FROM topics WHERE LOWER(name) = ANY($1)`,
      [loweredTopics]
    );

    // If counts mismatch, some topics don't exist => abort
    if (existingTopics.length !== topics.length) {
      const existingNames = existingTopics.map(t => t.name);
      const missing = topics.filter(t => !existingNames.includes(t.toLowerCase()));
      throw new Error(`Topic(s) do not exist in DB: ${missing.join(', ')}`);
    }

    // Check if question exists and get current title
    const questionResult = await client.query(
      'SELECT title FROM questions WHERE id = $1',
      [id]
    );

    if (questionResult.rowCount === 0) {
      await client.query('COMMIT');
      return { updated: false };
    }

    const oldTitle = questionResult.rows[0].title;

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      throw new Error(`Invalid difficulty level. Must be one of: ${validDifficulties.join(', ')}`);
    }

    // Update question
    await client.query(`
      UPDATE questions 
      SET title = $1, difficulty = $2, description = $3, question_constraints = $4
      WHERE id = $5
    `, [title, difficulty.toLowerCase(), description, question_constraints, id]);

    // Delete old test cases
    await client.query('DELETE FROM test_cases WHERE question_id = $1', [id]);

    // Insert new test cases
    for (const [index, testCase] of test_cases.entries()) {
      await client.query(`
        INSERT INTO test_cases (question_id, index, input, output)
        VALUES ($1, $2, $3, $4)
      `, [id, index, testCase.input, testCase.output]);
    }

    // Delete old topic relationships
    await client.query('DELETE FROM question_topics WHERE question_id = $1', [id]);

    // Insert new topic relationships using the validated existing topics
    for (const topic of existingTopics) {
      // Create question-topic relationship
      await client.query(`
        INSERT INTO question_topics (question_id, topic_id)
        VALUES ($1, $2)
      `, [id, topic.id]);
    }

    // Commit transaction
    await client.query('COMMIT');

    // Return updated status and titles
    return { updated: true, oldTitle, newTitle: title };
  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('[ERROR] updateQuestionInDb:', err.message);
    throw err;
  } finally {
    // Release client back to pool
    client.release();
  }
}


export async function deleteQuestionFromDb(questionId) {
  const client = await pool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');

    // First get the question title
    const questionResult = await client.query(
      'SELECT title FROM questions WHERE id = $1',
      [questionId]
    );

    if (questionResult.rowCount === 0) {
      await client.query('COMMIT');
      return { deleted: false };
    }

    const { title } = questionResult.rows[0];

    // Delete test cases
    await client.query('DELETE FROM test_cases WHERE question_id = $1', [questionId]);

    // Delete question-topic relationships
    await client.query('DELETE FROM question_topics WHERE question_id = $1', [questionId]);

    // Delete the question
    await client.query('DELETE FROM questions WHERE id = $1', [questionId]);

    // Prevent ID reuse: Ensure the sequence is advanced past the deleted ID
    const seqRes = await client.query(
      `SELECT pg_get_serial_sequence('questions', 'id') AS seqname`
    );
    const seqName = seqRes.rows[0] && seqRes.rows[0].seqname;
    if (seqName) {
      // Get the current sequence value
      const currentSeqResult = await client.query(
        `SELECT last_value FROM ${seqName}`
      );
      const currentSeq = currentSeqResult.rows[0].last_value;

      // If the deleted ID is >= current sequence, advance the sequence past it
      if (questionId >= currentSeq) {
        await client.query(
          `SELECT setval($1, $2)`,
          [seqName, questionId]
        );
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    // Return both deletion status and question title
    return { deleted: true, title };
  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('[ERROR] deleteQuestionFromDb:', err.message);
    throw err;
  } finally {
    // Release client back to pool
    client.release();
  }
}


export async function addQuestionToDb({ title, difficulty, description, question_constraints, topics, test_cases }) {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Ensure question ID sequence is correct
    const seqRes = await client.query(
      `SELECT pg_get_serial_sequence('questions', 'id') AS seqname`
    );
    const seqName = seqRes.rows[0] && seqRes.rows[0].seqname;
    if (seqName) {
      // setval(seq, MAX(id)) - set sequence to the current max id in the table
      // so the next nextval() will return max(id) + 1
      await client.query(
        `SELECT setval($1, COALESCE((SELECT MAX(id) FROM questions), 0))`,
        [seqName]
      );
    }
    
    // Verify all provided topics exist
    const loweredTopics = topics.map(t => t.toLowerCase());
    const { rows: existingTopics } = await client.query(
      `SELECT id, LOWER(name) AS name FROM topics WHERE LOWER(name) = ANY($1)`,
      [loweredTopics]
    );

    // If counts mismatch, some topics are missing => abort
    if (existingTopics.length !== topics.length) {
      const existingNames = existingTopics.map(t => t.name);
      const missing = topics.filter(t => !existingNames.includes(t.toLowerCase()));
      throw new Error(`Topic(s) do not exist in DB: ${missing.join(', ')}`);
    }

    // Insert the question
    const questionInsertQuery = `
      INSERT INTO questions (title, difficulty, description, question_constraints)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const questionValues = [title, difficulty, description, question_constraints];
    const qRes = await client.query(questionInsertQuery, questionValues);
    const questionId = qRes.rows[0].id;

    // Link question -> topics
    for (const t of existingTopics) {
      await client.query(
        `INSERT INTO question_topics (question_id, topic_id) VALUES ($1, $2)`,
        [questionId, t.id]
      );
    }

    // Insert test cases
    for (let i = 0; i < test_cases.length; i++) {
      const tc = test_cases[i];

      // If caller passed an explicit index property and it's a positive integer, use it.
      // Otherwise, use i+1 (1-based).
      let tcIndex = null;
      if (tc && Number.isInteger(tc.index) && tc.index > 0) {
        tcIndex = tc.index;
      } else {
        tcIndex = i + 1;
      }

      await client.query(
        `INSERT INTO test_cases (question_id, index, input, output)
         VALUES ($1, $2, $3, $4)`,
        [questionId, tcIndex, tc.input, tc.output]
      );
    }

    // Commit everything
    await client.query('COMMIT');

    // Fetch and return the newly created question with all details
    const fetchQuery = `
      SELECT 
        q.id,
        q.title,
        q.difficulty,
        q.description,
        q.question_constraints,
        COALESCE((
          SELECT JSON_AGG(JSON_BUILD_OBJECT('id', t.id, 'topic', t.name))
          FROM question_topics qt
          JOIN topics t ON qt.topic_id = t.id
          WHERE qt.question_id = q.id
        ), '[]') AS topics,
        COALESCE((
          SELECT JSON_AGG(JSON_BUILD_OBJECT('index', tc.index, 'input', tc.input, 'output', tc.output)
                          ORDER BY tc.index ASC)
          FROM test_cases tc
          WHERE tc.question_id = q.id
        ), '[]') AS test_cases
      FROM questions q
      WHERE q.id = $1
    `;
    const { rows } = await client.query(fetchQuery, [questionId]);
    return rows[0];
  } catch (err) {
    // Rollback and rethrow so controller can send proper response
    await client.query('ROLLBACK');
    console.error('[ERROR] addQuestionToDb:', err.message);
    throw err;
  } finally {
    client.release();
  }
}


