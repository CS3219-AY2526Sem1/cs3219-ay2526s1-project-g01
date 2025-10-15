import { getAllQuestionsFromDb } from '../models/question.js';

/*
  Controller to handle GET /question/
  Handles optional query parameters:
    - topic: filter questions by topic
    - difficulty: filter questions by difficulty level (easy, medium, hard)
    - limit: limit the number of questions returned
*/
export async function getAllQuestions(req, res) {
  try {
    const {topic, difficulty, limit} = req.query;

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

    // Fetch questions from the database
    const questions = await getAllQuestionsFromDb({ topic, difficulty, limit:parsedLimit });

    res.status(200).json({ data: questions });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve questions:', err.message);
    res.status(500).json({ message: 'Failed to retrieve questions', error: err.message });
  }
}


// export async function getQuestion(req, res) {
//   try {
//     const question = await questionModel.getQuestionById(req.params.id);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
//     res.status(200).json({ data: question });
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving question', error: err.message });
//   }
// }
