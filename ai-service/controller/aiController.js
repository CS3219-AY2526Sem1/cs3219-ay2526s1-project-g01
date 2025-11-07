/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Controller logic for handling AI chat requests with validation and error handling
 * Author Review: Input validation and error handling patterns reviewed
 */

const aiService = require("../services/aiService");

/**
 * Handle chat request with AI assistant
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.code - The code content from the editor
 * @param {string} req.body.language - Programming language
 * @param {string} req.body.message - User's question/message
 * @param {Array} req.body.conversationHistory - Previous conversation messages
 * @param {Object} res - Express response object
 */
exports.chat = async (req, res) => {
  try {
    const { code, language, message, conversationHistory = [] } = req.body;

    // Validate required fields
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Call AI service
    const response = await aiService.generateResponse({
      code,
      language,
      message,
      conversationHistory,
    });

    res.status(200).json({
      success: true,
      data: {
        response: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    // Handle errors
    if (error.message.includes("rate limit")) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to generate AI response. Please try again.",
    });
  }
};
