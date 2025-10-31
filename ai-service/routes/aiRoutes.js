/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: API routes for AI assistant chat endpoint
 * Author Review: REST API structure validated
 */

const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");

// Send message to AI assistant
router.post("/chat", aiController.chat);

module.exports = router;
