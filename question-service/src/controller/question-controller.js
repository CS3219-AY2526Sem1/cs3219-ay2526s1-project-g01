import { getAllQuestionsFromDb } from '../models/question.js';

export async function getAllQuestions(req, res) {
  try {
    const questions = await getAllQuestionsFromDb();
    res.status(200).json({ data: questions });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving questions', error: err.message });
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
