/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (GPT-5 mini), date: 2025-10-16
 * Purpose: To implement routes for question service including retrieval and creation.
 * Author Review: I refactored, then checked correctness and performance of the code.
 */

/* AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-10-10
 * Purpose: Implemented controllers for homepage question attempts statistics.
 * Author Review: I validated correctness and performance of the code.
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
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Route to search questions (changed from POST /)
// All search parameters are expected in the request body
router.post('/search', getAllQuestions);

// Route to add a new question
router.post('/create', verifyAccessToken, verifyIsAdmin, addQuestion);

// Route to get multiple questions by IDs
router.post('/batch', getQuestionsByIds);

// Route to get all topic names
router.get('/topics', getTopicNames);

// Route to add a new topic
router.post('/topics', verifyAccessToken, verifyIsAdmin, addTopic);

// Route to get a question by ID
router.get('/:id', getQuestionById);

// Route to update a question by ID
router.put('/:id', verifyAccessToken, verifyIsAdmin, updateQuestion);

// Route to delete a question by ID
router.delete('/:id', verifyAccessToken, verifyIsAdmin, deleteQuestion);

// Route to add a new attempt
router.post('/attempts', verifyAccessToken, createAttempt);

// Route to get all attempted questions by a user
router.get('/attempts/:user_id', verifyAccessToken, verifyIsOwnerOrAdmin, getUserAttempts);

// Route to get recent attempts by a user (limit via query param)
router.get('/attempts/:user_id/recent', verifyAccessToken, verifyIsOwnerOrAdmin, getRecentAttempts);

// Route to get total count of attempted questions by a user
router.get('/attempts/:user_id/count', verifyAccessToken, verifyIsOwnerOrAdmin, getTotalAttemptsCount);

// Route to get attempts in the past week by a user
router.get('/attempts/:user_id/week', verifyAccessToken, verifyIsOwnerOrAdmin, getAttemptsInPastWeek);

// Route to get all attempted topics and topic count by a user
router.get('/attempts/:user_id/topics', verifyAccessToken, verifyIsOwnerOrAdmin, getUserAttemptedTopics);

// Route to get (all) favourite topic(s) by a user
router.get('/attempts/:user_id/favourite-topic', verifyAccessToken, verifyIsOwnerOrAdmin, getUserFavoriteTopics);

export default router;
