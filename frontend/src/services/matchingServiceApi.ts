/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-10-29
 * Purpose: To add JWT authentication to matching service API calls for secure communication.
 * Author Review: I validated correctness, security, and performance of the code.
 */
/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-03
 * Purpose: To integrate question data retrieval and display in the collaboration page.
 * Author Review: Verified correctness and functionality of the code.
 */

import axios from "axios";
import { getToken } from "./userServiceCookies";

const API_GATEWAY_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL || "http://localhost";

export interface MatchRequest {
  userId: string;
  username?: string;
  difficulty: string[];
  topics: string[];
}

export interface MatchResponse {
  success: boolean;
  matchFound: boolean;
  sessionId?: string;
  message?: string;
  queueKey?: string;
  matchData?: {
    sessionId: string;
    user1: { userId: string; username: string };
    user2: { userId: string; username: string };
    criteria: { difficulty: string[]; topics: string[] };
    matchedAt: string;
    status: string;
  };
}

export interface QuestionTopic {
  id: number;
  topic: string;
}

export interface QuestionTestCase {
  index: number;
  input: string;
  output: string;
}

export interface Question {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  question_constraints: string;
  topics: QuestionTopic[];
  test_cases: QuestionTestCase[];
}

export interface MatchStatusResponse {
  success: boolean;
  status: "idle" | "searching" | "matched" | "active" | "failed";
  sessionId?: string;
  elapsedTime?: number;
  remainingTime?: number;
  criteria?: {
    difficulty: string[];
    topics: string[];
  };
  question?: Question;
  error?: string;
  errorMessage?: string;
  errorDetails?: {
    difficulty: string[];
    topics: string[];
  };
  canDelete?: boolean;
}

export interface TerminateResponse {
  success: boolean;
  terminated: boolean;
  message: string;
}

const getBaseURL = () => {
  return `${API_GATEWAY_BASE_URL}/api`;
};

const createApiClient = () => {
  const token = getToken();
  return axios.create({
    baseURL: getBaseURL(),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 10000,
  });
};

const API_ENDPOINTS = {
  MATCH: "/matching/match",
  STATUS: "/matching/status", // append /:userId
  TERMINATE: "/matching/match", // append /:userId
  SESSION: "/matching/session", // append /:sessionId
  STATS: "/matching/stats",
};

/**
 * Start matching process
 */
export const startMatch = async (
  request: MatchRequest
): Promise<MatchResponse> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post<MatchResponse>(
      API_ENDPOINTS.MATCH,
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error starting match:", error);
    throw error;
  }
};

/**
 * Get matching status
 */
export const getMatchStatus = async (
  userId: string
): Promise<MatchStatusResponse> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get<MatchStatusResponse>(
      `${API_ENDPOINTS.STATUS}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching match status:", error);
    throw error;
  }
};

/**
 * Terminate matching process
 */
export const terminateMatch = async (
  userId: string
): Promise<TerminateResponse> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.delete<TerminateResponse>(
      `${API_ENDPOINTS.TERMINATE}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error terminating match:", error);
    throw error;
  }
};

/**
 * Get session details
 */
export const getSession = async (sessionId: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `${API_ENDPOINTS.SESSION}/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

/**
 * End session (when user leaves collab)
 */
export const endSession = async (userId: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.delete(
      `${API_ENDPOINTS.SESSION}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error ending session:", error);
    throw error;
  }
};

/**
 * Get queue statistics (for admin/monitoring)
 */
// export const getQueueStats = async () => {
//   try {
//     const apiClient = createApiClient();
//     const response = await apiClient.get(API_ENDPOINTS.STATS);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching queue stats:", error);
//     throw error;
//   }
// };
