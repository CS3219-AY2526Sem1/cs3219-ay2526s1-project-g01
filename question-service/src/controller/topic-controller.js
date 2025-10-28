/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot, date: 2025-10-29
 * Purpose: Controller for topic endpoints.
 * Author Review: I checked correctness and performance of the code.
 */

import { getTopicNamesFromDb } from '../models/topic.js';

export async function getTopicNames(req, res) {
  try {
    const topics = await getTopicNamesFromDb();
    res.status(200).json(topics);
  } catch (err) {
    console.error('[ERROR] getTopicNames:', err.message);
    res.status(500).json({ 
      message: 'Failed to retrieve topics',
      error: err.message 
    });
  }
}