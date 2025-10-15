import express from 'express';
import { getAllQuestions } from '../controller/question-controller.js';

const router = express.Router();

router.get('/all', getAllQuestions);

export default router;
