import { getAllQuestionsFromDb } from '../models/question.js';

/*
  Controller to handle GET /question/
  Handles optional query parameters:
    - topic: filter questions by topic
    - difficulty: filter questions by difficulty level (easy, medium, hard)
    - limit: limit the number of questions returned
    - random: if true, returns questions in random order
*/
export async function getAllQuestions(req, res) {
  try {
    let { topic, difficulty, limit, random } = req.query;

    // Replace underscores with spaces 
    if (topic) {
      topic = topic.replace(/_/g, ' ');
    }


    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (difficulty && !validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid difficulty value' });
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
      topic, 
      difficulty, 
      limit: parsedLimit,
      random: isRandom 
    });

    res.status(200).json({ data: questions });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve questions:', err.message);
    res.status(500).json({ message: 'Failed to retrieve questions', error: err.message });
  }
}


