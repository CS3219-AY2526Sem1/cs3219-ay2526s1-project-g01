/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (GPT-5 mini), date: 2025-10-16
 * Purpose: To implement routes for question service including retrieval and creation.
 * Author Review: I refactored, then checked correctness and performance of the code.
 */

import express from 'express';
import { 
  getAllQuestions, 
  addQuestion, 
  deleteQuestion, 
  updateQuestion,
  getQuestionsByIds,
  getQuestionById
} from '../controller/question-controller.js';
import { getTopicNames, addTopic } from '../controller/topic-controller.js';

const router = express.Router();

// Route to search questions (changed from POST /)
// All search parameters are expected in the request body
router.post('/search', getAllQuestions);

// Route to add a new question
router.post('/create', addQuestion);

// Route to get multiple questions by IDs
router.post('/batch', getQuestionsByIds);

// Route to get all topic names
router.get('/topics', getTopicNames);

// Route to add a new topic
router.post('/topics', addTopic);

// Route to get a question by ID
router.get('/:id', getQuestionById);

// Route to update a question by ID
router.put('/:id', updateQuestion);

// Route to delete a question by ID
router.delete('/:id', deleteQuestion);

export default router;
