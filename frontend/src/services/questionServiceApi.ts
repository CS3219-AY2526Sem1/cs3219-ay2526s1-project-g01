/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-03
 * Purpose: For frontend to display live data from question-service
 * Author Review: I validated correctness, security, and performance of the code.
 */

/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-11-08
 * Purpose: Added API function for marking question attempts
 * Author Review: Validated correctness and error handling
 */

/**
 * API service for question-service endpoints
 */

import axios from "axios";
import { getToken } from "./userServiceCookies";

const API_GATEWAY_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL || "http://localhost";

const getApiBaseUrl = () => {
  return `${API_GATEWAY_BASE_URL}/api`;
};

const createApiClient = () => {
  const token = getToken();
  return axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
    timeout: 10000,
  });
};

const API_ENDPOINTS = {
  TOPICS: "/questions/topics",
  ATTEMPTS: "/questions/attempts",
};

/**
 * Interface for attempt record returned from the API
 */
interface AttemptRecord {
  id: number;
  question_id: number;
  user_id: string;
  attempted_date: string;
}

/**
 * Interface for the response when marking a question as attempted
 */
interface MarkAttemptResponse {
  message: string;
  data: AttemptRecord[];
}

/**
 * Fetch all available topics from the question-service
 * @returns Promise with array of topic names
 */
export const fetchTopics = async (): Promise<string[]> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get<string[]>(API_ENDPOINTS.TOPICS);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to fetch topics:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch topics from question service",
      );
    }
    throw error;
  }
};

/**
 * Mark a question as attempted by users
 * @param questionId - The question ID
 * @param userIds - Array of user IDs (MongoDB ObjectId strings)
 * @param attemptedDate - Date in YYYY-MM-DD format
 * @returns Promise with attempt creation result
 */
export const markQuestionAttempted = async (
  questionId: number,
  userIds: string[],
  attemptedDate: string,
): Promise<MarkAttemptResponse> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post<MarkAttemptResponse>(
      API_ENDPOINTS.ATTEMPTS,
      {
        question_id: questionId,
        user_id: userIds,
        attempted_date: attemptedDate,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to mark question as attempted:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to mark question as attempted",
      );
    }
    throw error;
  }
};
