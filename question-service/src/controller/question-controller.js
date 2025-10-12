import { getAllQuestions as getAllQuestionsFromDb } from '../models/question.js';

export async function getAllQuestions(req, res) {
  try {
    const questions = await getAllQuestionsFromDb();
    res.status(200).json({ data: questions });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving questions', error: err.message });
  }
}
