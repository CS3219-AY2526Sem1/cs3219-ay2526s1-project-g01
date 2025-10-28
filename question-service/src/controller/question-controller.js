/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (GPT-5 mini), date: 2025-10-16
 * Purpose: To implement controllers for retrieving and creating questions.
 * Author Review: I modified to add validation and error handling, checked correctness and performance of the code.
 */
/**
 * AI Assistance Disclosure:
 * Tool: Github Copilot (Claude Sonnet 3.5), date: 2025-10-29
 * Purpose: To implement controllers for adding new questions, deleting question by id.
 * Author Review: I modified to add validation and error handling, checked correctness and performance of the code.
 */

import { 
  getAllQuestionsFromDb, 
  addQuestionToDb, 
  deleteQuestionFromDb, 
  updateQuestionInDb, 
  getQuestionsByIdsFromDb 
} from '../models/question.js';

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

/*
  Controller to handle POST /question/
  Handles request body parameters:
    - topic: filter questions by topic
    - difficulty: filter questions by difficulty level (easy, medium, hard)
  Handles optional query parameters:
    - limit: limit the number of questions returned
    - random: if true, returns questions in random order
*/
export async function getAllQuestions(req, res) {
  try {
    let { topic, difficulty } = req.body ?? {};
    let { limit, random } = req.query;

    // Convert to arrays if not already in array form
    if (topic && !Array.isArray(topic)) {
      topic = [topic];
    }
    if (difficulty && !Array.isArray(difficulty)) {
      difficulty = [difficulty];
    }

    // Replace underscores with spaces 
    if (topic) {
      topic = topic.map(t => t.replace(/_/g, ' ').toLowerCase());
    }

    // Validate difficulties
    if (difficulty) {
      difficulty = difficulty.map(d => d.toLowerCase()); // 
      if (!difficulty.every(d => VALID_DIFFICULTIES.includes(d))) {
        return res.status(400).json({ message: 'Invalid difficulty value(s)' });
      }
    }

    // Parse and validate limit
    const parsedLimit = limit ? parseInt(limit, 10) : null;
    if (parsedLimit !== null && (isNaN(parsedLimit) || parsedLimit <= 0)) {
      return res.status(400).json({ message: 'Invalid limit value. Must be a positive number.' });
    }

    // Check if random is set to true
    const isRandom = random === 'true' ? true : false;

    // Fetch questions from the database
    const questions = await getAllQuestionsFromDb({ 
      topics: topic,
      difficulties: difficulty,
      limit: parsedLimit,
      random: isRandom 
    });

    res.status(200).json({ data: questions });
  } catch (err) {
    console.error('[ERROR] Failed to retrieve questions:', err.message);
    res.status(500).json({ message: 'Failed to retrieve questions', error: err.message });
  }
}

/*
  Controller to handle POST /question/add
  Request body parameters:
    - title: string (required)
    - difficulty: string (required) - one of 'easy', 'medium', 'hard'
    - description: string (required)
    - question_constraints: string (required)
    - topics: array of strings (required)
    - test_cases: array of objects (required) - each object having 'input' and 'output' properties
*/
export async function addQuestion(req, res) {
  try {
    let { title, difficulty, description, question_constraints, topics, test_cases } = req.body;

    // Validate required fields
    if (!title || !difficulty || !description || !question_constraints || !topics || !test_cases) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide title, difficulty, description, question_constraints, topics, and test_cases.' 
      });
    }

    // Validate and trim title
    if (typeof title !== 'string') {
      return res.status(400).json({ message: 'Title must be a string.' });
    }
    title = title.trim();
    if (title.length === 0) {
      return res.status(400).json({ message: 'Title cannot be empty or just whitespace.' });
    }

    // Validate and trim difficulty
    if (typeof difficulty !== 'string') {
      return res.status(400).json({ message: 'Difficulty must be a string.' });
    }
    difficulty = difficulty.trim().toLowerCase();
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ 
        message: 'Invalid difficulty value. Must be one of: easy, medium, hard.' 
      });
    }

    // Validate description is non-empty string
    if (typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ message: 'Description must be a non-empty string.' });
    }

    // Validate question_constraints is non-empty string
    if (typeof question_constraints !== 'string' || question_constraints.trim().length === 0) {
      return res.status(400).json({ message: 'Question constraints must be a non-empty string.' });
    }

    // Validate topics is non-empty array of strings
    if (!Array.isArray(topics) || topics.length === 0 || 
        !topics.every(topic => typeof topic === 'string' && topic.trim().length > 0)) {
      return res.status(400).json({ 
        message: 'Topics must be a non-empty array of strings.' 
      });
    }

    // Validate test_cases is non-empty array of valid test cases
    if (!Array.isArray(test_cases) || test_cases.length === 0) {
      return res.status(400).json({ 
        message: 'Test cases must be a non-empty array.' 
      });
    }

    // Validate each test case has input and output
    for (const [index, testCase] of test_cases.entries()) {
      if (!testCase || typeof testCase !== 'object' || 
          !('input' in testCase) || !('output' in testCase)) {
        return res.status(400).json({ 
          message: `Invalid test case at index ${index}. Each test case must have 'input' and 'output' properties.` 
        });
      }
    }

    // Normalize topics (lowercase and replace underscores with spaces)
    const normalizedTopics = topics.map(t => t.replace(/_/g, ' ').toLowerCase());

    // Add question to database
    const question = await addQuestionToDb({
      title,
      difficulty: difficulty.toLowerCase(),
      description,
      question_constraints,
      topics: normalizedTopics,
      test_cases
    });

    res.status(201).json({ 
      message: 'Question created successfully',
      data: question
    });
  } catch (err) {
    console.error('[ERROR] Failed to add question:', err.message);
    res.status(500).json({ 
      message: 'Failed to add question', 
      error: err.message 
    });
  }
}


/*
  Controller to handle POST /questions/bulk
  Request body parameters:
    - ids: array of question IDs to retrieve
  Returns:
    - 200: Questions found, returns array of question objects
    - 400: Invalid request (missing ids or invalid format)
    - 404: If none of the requested questions were found
    - 500: Server error
*/
export async function getQuestionsByIds(req, res) {
  try {
    const { ids } = req.body;

    // Validate ids is provided and is an array
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        message: 'Request body must include "ids" as an array of question IDs.'
      });
    }

    // Validate each ID is a positive integer
    const questionIds = ids.map(id => parseInt(id, 10));
    if (questionIds.some(id => isNaN(id) || id <= 0)) {
      return res.status(400).json({
        message: 'All question IDs must be positive integers.'
      });
    }

    // Remove duplicates
    const uniqueIds = [...new Set(questionIds)];

    // Get questions from database
    const questions = await getQuestionsByIdsFromDb(uniqueIds);

    if (questions.length === 0) {
      return res.status(404).json({
        message: 'None of the requested questions were found'
      });
    }

    // Include information about which questions were found and not found
    const foundIds = questions.map(q => q.id);
    const notFoundIds = uniqueIds.filter(id => !foundIds.includes(id));

    const response = {
      data: questions,
      meta: {
        requested: uniqueIds.length,
        found: questions.length,
        notFound: notFoundIds
      }
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('[ERROR] Failed to retrieve questions:', err.message);
    res.status(500).json({
      message: 'Failed to retrieve questions',
      error: err.message
    });
  }
}



/*
  Controller to handle DELETE /question/delete
  Request query parameters:
    - id: the ID of the question to delete
  Returns:
    - 200: If question was successfully deleted
    - 404: If question with given ID was not found
    - 400: If ID is missing or invalid
    - 500: If there was a server error
*/
export async function updateQuestion(req, res) {
  try {
    let { id, title, difficulty, description, question_constraints, topics, test_cases } = req.body;

    // Validate question id is provided and valid
    if (!id) {
      return res.status(400).json({
        message: 'Missing required field: id'
      });
    }

    // Validate id is a positive integer
    const questionId = parseInt(id, 10);
    if (isNaN(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: 'Invalid question ID. Must be a positive integer.'
      });
    }

    // Validate required fields
    if (!title || !difficulty || !description || !question_constraints || !topics || !test_cases) {
      return res.status(400).json({
        message: 'Missing required fields. Please provide title, difficulty, description, question_constraints, topics, and test_cases.'
      });
    }

    // Validate and trim title
    if (typeof title !== 'string') {
      return res.status(400).json({ message: 'Title must be a string.' });
    }
    title = title.trim();
    if (title.length === 0) {
      return res.status(400).json({ message: 'Title cannot be empty or just whitespace.' });
    }

    // Validate and trim difficulty
    if (typeof difficulty !== 'string') {
      return res.status(400).json({ message: 'Difficulty must be a string.' });
    }
    difficulty = difficulty.trim().toLowerCase();
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        message: 'Invalid difficulty value. Must be one of: easy, medium, hard.'
      });
    }

    // Validate description is non-empty string
    if (typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ message: 'Description must be a non-empty string.' });
    }

    // Validate question_constraints is non-empty string
    if (typeof question_constraints !== 'string' || question_constraints.trim().length === 0) {
      return res.status(400).json({ message: 'Question constraints must be a non-empty string.' });
    }

    // Validate topics is non-empty array of strings
    if (!Array.isArray(topics) || topics.length === 0 ||
        !topics.every(topic => typeof topic === 'string' && topic.trim().length > 0)) {
      return res.status(400).json({
        message: 'Topics must be a non-empty array of strings.'
      });
    }

    // Validate test_cases is non-empty array of valid test cases
    if (!Array.isArray(test_cases) || test_cases.length === 0) {
      return res.status(400).json({
        message: 'Test cases must be a non-empty array.'
      });
    }

    // Validate each test case has input and output
    for (const [index, testCase] of test_cases.entries()) {
      if (!testCase || typeof testCase !== 'object' ||
          !('input' in testCase) || !('output' in testCase)) {
        return res.status(400).json({
          message: `Invalid test case at index ${index}. Each test case must have 'input' and 'output' properties.`
        });
      }
    }

    // Normalize topics (lowercase and replace underscores with spaces)
    const normalizedTopics = topics.map(t => t.replace(/_/g, ' ').toLowerCase());

    // Update question in database
    const result = await updateQuestionInDb({
      id: questionId,
      title,
      difficulty,
      description,
      question_constraints,
      topics: normalizedTopics,
      test_cases
    });

    if (!result.updated) {
      return res.status(404).json({
        message: `Question with ID ${questionId} not found`
      });
    }

    res.status(200).json({
      message: `Question "${result.oldTitle}" updated to "${result.newTitle}" successfully`
    });
  } catch (err) {
    console.error('[ERROR] Failed to update question:', err.message);
    res.status(500).json({
      message: 'Failed to update question',
      error: err.message
    });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const { id } = req.query;

    // Validate id is provided
    if (!id) {
      return res.status(400).json({ 
        message: 'Missing required query parameter: id' 
      });
    }

    // Validate id is a positive integer
    const questionId = parseInt(id, 10);
    if (isNaN(questionId) || questionId <= 0) {
      return res.status(400).json({ 
        message: 'Invalid question ID. Must be a positive integer.' 
      });
    }

    // Attempt to delete the question
    const result = await deleteQuestionFromDb(questionId);

    if (!result.deleted) {
      return res.status(404).json({ 
        message: `Question with ID ${questionId} not found` 
      });
    }

    res.status(200).json({ 
      message: `Question "${result.title}" (ID: ${questionId}) successfully deleted` 
    });
  } catch (err) {
    console.error('[ERROR] Failed to delete question:', err.message);
    res.status(500).json({ 
      message: 'Failed to delete question', 
      error: err.message 
    });
  }
}

