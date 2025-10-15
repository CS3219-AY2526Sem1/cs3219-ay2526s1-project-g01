/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To fix Docker networking bug where middleware (server-side) and browser (client-side) need different API endpoints for same service.
 * Author Review: I validated correctness, security, and performance of the dynamic client creation approach.
 */

// API Configuration for PeerPrep Frontend
// Based on docker-compose.yml configuration with API Gateway
import axios from "axios";

// TypeScript interfaces for API responses
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

/**
 * Dynamic Base URL Detection
 *
 * This function determines the correct API endpoint based on execution context:
 * - Server-side (middleware): Direct container-to-container communication
 * - Client-side (browser): Through API Gateway proxy
 *
 * This fixes a Docker networking bug where the same code runs in different environments
 * and needs different URLs to reach the same service.
 */
const getBaseURL = () => {
  // Check if we're running server-side (middleware) or client-side (browser)
  const isServerSide = typeof window === "undefined";

  if (process.env.NODE_ENV === "production") {
    if (isServerSide) {
      // Server-side: Direct call to user-service container
      // This bypasses the API gateway for internal Docker networking
      return "http://user-service:4000";
    } else {
      // Client-side: Through API Gateway
      // Browser requests go through the nginx proxy on localhost
      return "http://localhost/api";
    }
  } else {
    // Development: Direct to user-service (no Docker containers)
    return "http://localhost:4000";
  }
};

/**
 * Dynamic Axios Client Creation
 *
 * We create a new axios instance for each request instead of using a module-level singleton.
 * This is necessary because:
 *
 * 1. The same module code runs in both server-side (middleware) and client-side (browser) contexts
 * 2. Each context needs a different base URL to reach the user service
 * 3. A singleton axios instance would "freeze" the URL from the first context that loads it
 * 4. Dynamic creation ensures getBaseURL() runs fresh for each request context
 *
 * This fixes the Docker networking bug where middleware couldn't reach the user service.
 */
const createApiClient = () => {
  return axios.create({
    baseURL: getBaseURL(), // Fresh URL calculation for current execution context
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds timeout
  });
};

// API Endpoints
const API_ENDPOINTS = {
  // users
  USER_SERVICE: "/users",
  // auth
  AUTH_SERVICE: "/auth",
  // verification
  VERIFICATION_SERVICE: "/verification",
};

/**
 * @param token JWT token string
 * @returns Response containing the user name
 */
const verifyToken = async (token: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `${API_ENDPOINTS.AUTH_SERVICE}/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

/**
 * Logs in a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Response containing access token and user data
 */
const login = async (email: string, password: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.AUTH_SERVICE}/login`,
      {
        email,
        password,
      },
    );
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Signs up a new user
 * @param username User's username
 * @param email User's email address
 * @param password User's password
 * @returns Response containing user data
 */
const signup = async (username: string, email: string, password: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(`${API_ENDPOINTS.USER_SERVICE}/`, {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

const verifyUserEmail = async (
  token: string,
  username: string,
  email: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/verify?token=${encodeURIComponent(token)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
    );
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

const resendEmailVerification = async (username: string, email: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/resend?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
    );
    return response;
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw error;
  }
};

// Export configuration
export { verifyToken, login, signup, verifyUserEmail, resendEmailVerification };
