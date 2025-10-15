import { getAllQuestionsFromDb } from '../models/question.js';

export async function getAllQuestions(req, res) {
  try {
    const {topic, difficulty} = req.query;

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (difficulty && !validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid difficulty value' });
    }

    const questions = await getAllQuestionsFromDb({ topic, difficulty });

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
