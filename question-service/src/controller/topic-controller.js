/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot, date: 2025-10-29
 * Purpose: Controller for topic endpoints.
 * Author Review: I checked correctness and performance of the code.
 */

import { getTopicNamesFromDb, addTopicToDb } from '../models/topic.js';

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

export async function addTopic(req, res) {
  try {    
    const { name } = req.body;

    // Input validation
    if (!name) {
      return res.status(400).json({
        message: 'Topic name is required in query parameter "name"'
      });
    }

    // Trim whitespace and check length
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return res.status(400).json({
        message: 'Topic name cannot be empty'
      });
    }

    if (trimmedName.length > 50) {
      return res.status(400).json({
        message: 'Topic name cannot exceed 50 characters'
      });
    }

    const result = await addTopicToDb(trimmedName);
    res.status(201).json({ 
      message: `Topic "${result.name}" added successfully` 
    });
  } catch (err) {
    console.error('[ERROR] addTopic:', err.message);
    
    // Handle duplicate topic error specifically
    if (err.message.includes('already exists')) {
      return res.status(409).json({ 
        message: err.message 
      });
    }

    res.status(500).json({ 
      message: 'Failed to add topic',
      error: err.message 
    });
  }
}
