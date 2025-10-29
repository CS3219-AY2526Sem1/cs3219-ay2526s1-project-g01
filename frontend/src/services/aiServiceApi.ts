/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: TypeScript API client for communicating with AI service backend
 * Author Review: Type definitions and error handling validated
 */

/**
 * AI Service API Client
 * Handles communication with the AI service backend
 */

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8086";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  code?: string;
  language?: string;
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  data?: {
    response: string;
    timestamp: string;
  };
  error?: string;
}

/**
 * Send a chat message to the AI assistant
 * @param request - The chat request containing code, language, message, and history
 * @returns Promise with the AI response
 */
export async function sendAiChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to get AI response",
      };
    }

    return data;
  } catch (error) {
    console.error("AI Service API Error:", error);
    return {
      success: false,
      error: "Failed to connect to AI service. Please try again later.",
    };
  }
}
