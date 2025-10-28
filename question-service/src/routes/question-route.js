/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (GPT-5 mini), date: 2025-10-16
 * Purpose: To implement routes for question service including retrieval and creation.
 * Author Review: I refactored, then checked correctness and performance of the code.
 */

import express from 'express';
import { getAllQuestions, addQuestion, deleteQuestion } from '../controller/question-controller.js';

const router = express.Router();

// Route to get filtered questions
router.post('/', getAllQuestions);

// Route to add a new question
router.post('/add', addQuestion);

// Route to delete a question by ID
router.delete('/delete', deleteQuestion);

export default router;
