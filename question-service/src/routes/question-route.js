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
import {
  createAttempt,
  getUserAttempts,
  getUserAttemptedTopics,
  getUserFavoriteTopics,
  getTotalAttemptsCount,
  getAttemptsInPastWeek,
  getRecentAttempts
} from '../controller/attempts-controller.js';

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

// Route to add a new attempt
router.post('/attempts', createAttempt);

// Route to get all attempted questions by a user
router.get('/attempts/:user_id', getUserAttempts);

// Route to get recent attempts by a user (limit via query param)
router.get('/attempts/:user_id/recent', getRecentAttempts);

// Route to get total count of attempted questions by a user
router.get('/attempts/:user_id/count', getTotalAttemptsCount);

// Route to get attempts in the past week by a user
router.get('/attempts/:user_id/week', getAttemptsInPastWeek);

// Route to get all attempted topics and topic count by a user
router.get('/attempts/:user_id/topics', getUserAttemptedTopics);

// Route to get (all) favourite topic(s) by a user
router.get('/attempts/:user_id/favourite-topic', getUserFavoriteTopics);

export default router;
