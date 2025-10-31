/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (GPT-5 mini), date: 2025-10-16
 * Purpose: To generate a boilderplate router for question service to get all questions with filters.
 * Author Review: I refactored, then checked correctness and performance of the code.
 */

import express from 'express';
import { getAllQuestions } from '../controller/question-controller.js';

const router = express.Router();

router.post('/', getAllQuestions);

export default router;
