/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (GPT-5 mini), date: 2025-10-16
 * Purpose: To generate a boilerplate controller for question service to get all questions with filters.
 * Author Review: I modified to add validation and error handling, checked correctness and performance of the code.
 */

import { getAllQuestionsFromDb } from '../models/question.js';

/*
  Controller to handle POST /question/
  Handles request body parameters:
    - topic: filter questions by topic
    - difficulty: filter questions by difficulty level (easy, medium, hard)
  Handles optional query parameters:
    - limit: limit the number of questions returned
    - random: if true, returns questions in random order
*/
export async function getAllQuestions(req, res) {
  try {
    let { topic, difficulty } = req.body ?? {};
    let { limit, random } = req.query;

    // Convert to arrays if not already in array form
    if (topic && !Array.isArray(topic)) {
      topic = [topic];
    }
    if (difficulty && !Array.isArray(difficulty)) {
      difficulty = [difficulty];
    }

    // Replace underscores with spaces 
    if (topic) {
      topic = topic.map(t => t.replace(/_/g, ' ').toLowerCase());
    }

    // Validate difficulties
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (difficulty) {
      difficulty = difficulty.map(d => d.toLowerCase()); // 
      if (!difficulty.every(d => validDifficulties.includes(d))) {
        return res.status(400).json({ message: 'Invalid difficulty value(s)' });
      }
    }

    // Parse and validate limit
    const parsedLimit = limit ? parseInt(limit, 10) : null;
    if (parsedLimit !== null && (isNaN(parsedLimit) || parsedLimit <= 0)) {
      return res.status(400).json({ message: 'Invalid limit value. Must be a positive number.' });
    }

    // Check if random is set to true
    const isRandom = random === 'true' ? true : false;

    // Fetch questions from the database
    const questions = await getAllQuestionsFromDb({ 
      topics: topic,
      difficulties: difficulty,
      limit: parsedLimit,
      random: isRandom 
    });

    res.status(200).json({ data: questions });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve questions:', err.message);
    res.status(500).json({ message: 'Failed to retrieve questions', error: err.message });
  }
}


