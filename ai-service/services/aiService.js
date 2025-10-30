/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Google Gemini API integration for generating AI responses with code context
 * Author Review: API integration validated, prompt engineering reviewed, error handling tested, added system guardrails
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialise Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI response for code explanation
 * @param {Object} params
 * @param {string} params.code - The code content
 * @param {string} params.language - Programming language
 * @param {string} params.message - User's question
 * @param {Array} params.conversationHistory - Previous messages
 * @returns {Promise<string>} AI response
 */
exports.generateResponse = async ({
  code,
  language,
  message,
  conversationHistory,
}) => {
  try {
    const modelName =
      process.env.GEMINI_MODEL?.trim() || "models/gemini-2.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    // Build the prompt with context
    const systemPrompt = `You are an expert programming assistant helping users understand and improve their code. You are integrated into a collaborative coding platform called PeerPrep where users practice coding interviews together.

Your role:
- Explain code clearly and concisely
- Help debug issues and suggest fixes
- Suggest optimizations and best practices
- Answer questions about algorithms and data structures
- Be encouraging and educational

Keep responses:
- Clear and well-structured (use markdown formatting)
- Concise but thorough
- Focused on the specific question asked
- Include code examples when helpful

Safety guardrails:
- Only assist with programming, software engineering, or computer science topics; politely decline all other requests.
- Refuse to create, enhance, or explain malware, exploits, or instructions that enable illicit access or harm.
- Do not provide steps that bypass security, licensing, or safety restrictions.
- Avoid generating or requesting personal data or secrets; remind users to keep sensitive information private.
- When declining, offer a brief explanation and redirect the user toward safe, code-focused guidance when possible.`;

    // Build conversation context
    let fullPrompt = systemPrompt + "\n\n";

    // Add code context from the code editor if any (by default)
    if (code && code.trim() !== "") {
      fullPrompt += `Current Code (${language || "Unknown"}):\n\`\`\`${language?.toLowerCase() || ""}\n${code}\n\`\`\`\n\n`;
    }

    // Add conversation history (last 5 messages to stay within context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      fullPrompt += "Previous conversation:\n";
      recentHistory.forEach((msg) => {
        fullPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
      fullPrompt += "\n";
    }

    // Add current user message
    fullPrompt += `User: ${message}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Handle specific Gemini errors
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API key configuration");
    }

    if (error.message?.includes("RATE_LIMIT_EXCEEDED")) {
      throw new Error("AI service rate limit exceeded");
    }

    if (error.message?.includes("Not Found")) {
      throw new Error(
        `Gemini model "${modelName}" is unavailable. Update GEMINI_MODEL to a supported model from https://ai.google.dev/models.`,
      );
    }

    throw new Error("Failed to generate AI response");
  }
};
