/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot, date: 2025-10-29
 * Purpose: Database operations for topics.
 * Author Review: I checked correctness and performance of the code.
 */

import pool from '../db.js';

export async function getTopicNamesFromDb() {
  try {
    const query = `
      SELECT LOWER(name) as name
      FROM topics 
      ORDER BY name ASC
    `;
    const { rows } = await pool.query(query);
    // Map the rows to just an array of names
    return rows.map(row => row.name);
  } catch (err) {
    console.error('[ERROR] getTopicNamesFromDb:', err.message);
    throw err;
  }
}

export async function addTopicToDb(topicName) {
  const client = await pool.connect();
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    // Check if topic already exists (case-insensitive)
    const existingTopic = await client.query(
      'SELECT name FROM topics WHERE LOWER(name) = LOWER($1)',
      [topicName]
    );
    
    if (existingTopic.rows.length > 0) {
      throw new Error(`Topic "${existingTopic.rows[0].name}" already exists`);
    }

    // Insert new topic
    const query = `
      INSERT INTO topics (name)
      VALUES ($1)
      RETURNING name
    `;
    const { rows } = await client.query(query, [topicName]);
    
    // Commit transaction
    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ERROR] addTopicToDb:', err.message);
    throw err;
  } finally {
    client.release();
  }
}