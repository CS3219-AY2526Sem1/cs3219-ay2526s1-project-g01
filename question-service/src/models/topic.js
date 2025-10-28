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
      SELECT name 
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