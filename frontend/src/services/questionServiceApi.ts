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
  USER_ATTEMPTS: (userId: string) => `/questions/attempts/${userId}`,
  RECENT_ATTEMPTS: (userId: string, limit?: number) => 
    `/questions/attempts/${userId}/recent${limit ? `?limit=${limit}` : ''}`,
  ATTEMPTS_COUNT: (userId: string) => `/questions/attempts/${userId}/count`,
  WEEKLY_ATTEMPTS: (userId: string) => `/questions/attempts/${userId}/week`,
  FAVORITE_TOPIC: (userId: string) => `/questions/attempts/${userId}/favourite-topic`,
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
 * Interface for last attempted question
 */
export interface LastAttemptedQuestion {
  question_id: number;
  title: string;
  difficulty: string;
  topics: string[];
  attempted_date: string;
}

/**
 * Interface for weekly attempts response
 */
export interface WeeklyAttempts {
  count: number;
  questions: Array<{
    question_id: number;
    title: string;
    difficulty: string;
    attempted_date: string;
  }>;
}

/**
 * Interface for user statistics
 */
export interface UserStatistics {
  totalAttempts: number;
  weeklyAttempts: number;
  favoriteTopics: string[];
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
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to mark question as attempted:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to mark question as attempted",
      );
    }
    throw error;
  }
};

/**
 * Fetch the total count of questions attempted by a user
 * @param userId - The user ID
 * @returns Promise with total count
 */
export const fetchTotalAttemptsCount = async (
  userId: string,
): Promise<number> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(API_ENDPOINTS.ATTEMPTS_COUNT(userId));
    return response.data.data.total_count;
  } catch (error) {
    console.error("Failed to fetch total attempts count:", error);
    return 0;
  }
};

/**
 * Fetch the count of questions attempted in the past week
 * @param userId - The user ID
 * @returns Promise with weekly attempts data
 */
export const fetchWeeklyAttempts = async (
  userId: string,
): Promise<WeeklyAttempts> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(API_ENDPOINTS.WEEKLY_ATTEMPTS(userId));
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch weekly attempts:", error);
    return { count: 0, questions: [] };
  }
};

/**
 * Fetch the favorite topics for a user
 * @param userId - The user ID
 * @returns Promise with array of favorite topic names
 */
export const fetchFavoriteTopics = async (
  userId: string,
): Promise<string[]> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(API_ENDPOINTS.FAVORITE_TOPIC(userId));
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      // User has no attempts
      return [];
    }
    console.error("Failed to fetch favorite topics:", error);
    return [];
  }
};

/**
 * Fetch recent attempts by a user
 * @param userId - The user ID
 * @param limit - Number of recent attempts to retrieve (default: 3)
 * @returns Promise with array of recent attempts
 */
export const fetchRecentAttempts = async (
  userId: string,
  limit: number = 3,
): Promise<LastAttemptedQuestion[]> => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(API_ENDPOINTS.RECENT_ATTEMPTS(userId, limit));
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch recent attempts:", error);
    return [];
  }
};

/**
 * Fetch all user statistics in one call
 * @param userId - The user ID
 * @returns Promise with all statistics
 */
export const fetchUserStatistics = async (
  userId: string,
): Promise<UserStatistics> => {
  try {
    const [totalAttempts, weeklyData, favoriteTopics] =
      await Promise.all([
        fetchTotalAttemptsCount(userId),
        fetchWeeklyAttempts(userId),
        fetchFavoriteTopics(userId),
      ]);

    return {
      totalAttempts,
      weeklyAttempts: weeklyData.count,
      favoriteTopics,
    };
  } catch (error) {
    console.error("Failed to fetch user statistics:", error);
    return {
      totalAttempts: 0,
      weeklyAttempts: 0,
      favoriteTopics: [],
    };
  }
};
