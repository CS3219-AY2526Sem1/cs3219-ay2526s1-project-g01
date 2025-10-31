/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To fix Docker networking bug where middleware (server-side) and browser (client-side) need different API endpoints for same service.
 * Author Review: I validated correctness, security, and performance of the dynamic client creation approach.
 *
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To add deleteAccount API function for permanent account deletion with proper authentication.
 * Author Review: I validated the implementation follows security best practices with authentication token validation.
 */

// API Configuration for PeerPrep Frontend
import axios from "axios";

const API_GATEWAY_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL || "http://localhost";
// note that for actual deployment to cloud, we will set it to same as API Gateway URL
// this is only for local dev with docker-compose
// because for some weird reason it doesn't work with localhost in middleware
const USER_SERVICE_URL: string =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://user-service:4000";

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
      return `${USER_SERVICE_URL}`;
    } else {
      // Client-side: Through API Gateway
      // Browser requests go through the nginx proxy on localhost
      return `${API_GATEWAY_BASE_URL}/api`;
    }
  } else {
    // Development: Direct to api gateway no weirdness
    return `${API_GATEWAY_BASE_URL}/api`;
  }
};

/**
 * Dynamic Axios Client Creation
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
  purpose?: string,
) => {
  try {
    const apiClient = createApiClient();
    let url = `${API_ENDPOINTS.VERIFICATION_SERVICE}/verify?token=${encodeURIComponent(token)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
    if (purpose) {
      url += `&purpose=${encodeURIComponent(purpose)}`;
    }
    const response = await apiClient.get(url);
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

const sendPasswordResetEmail = async (email: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.AUTH_SERVICE}/password/request-reset`,
      { email },
    );
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

const validatePasswordResetToken = async (
  username: string,
  email: string,
  token: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get(
      `${API_ENDPOINTS.AUTH_SERVICE}/password/validate-token?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
    );
    return response;
  } catch (error) {
    console.error("Error validating password reset token:", error);
    throw error;
  }
};

const confirmPasswordReset = async (
  username: string,
  email: string,
  token: string,
  newPassword: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.AUTH_SERVICE}/password/confirm-reset?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      { newPassword },
    );
    return response;
  } catch (error) {
    console.error("Error confirming password reset:", error);
    throw error;
  }
};

const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  token: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.patch(
      `${API_ENDPOINTS.USER_SERVICE}/${userId}/password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

const updateUsername = async (
  userId: string,
  username: string,
  token: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.patch(
      `${API_ENDPOINTS.USER_SERVICE}/${userId}/username`,
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
};

const requestEmailChangeCode = async (userId: string, token: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/request-email-change-code`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error requesting email change code:", error);
    throw error;
  }
};

const verifyEmailChangeCode = async (
  userId: string,
  code: string,
  token: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/verify-email-change-code`,
      { userId, code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error verifying email change code:", error);
    throw error;
  }
};

const changeEmail = async (
  userId: string,
  username: string,
  oldEmail: string,
  newEmail: string,
  code: string,
  token: string,
) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post(
      `${API_ENDPOINTS.VERIFICATION_SERVICE}/change-email`,
      { userId, username, oldEmail, newEmail, code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error changing email:", error);
    throw error;
  }
};

const deleteAccount = async (userId: string, token: string) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.delete(
      `${API_ENDPOINTS.USER_SERVICE}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

// Export configuration
export {
  verifyToken,
  login,
  signup,
  verifyUserEmail,
  resendEmailVerification,
  sendPasswordResetEmail,
  validatePasswordResetToken,
  confirmPasswordReset,
  updateUserPassword,
  updateUsername,
  requestEmailChangeCode,
  verifyEmailChangeCode,
  changeEmail,
  deleteAccount,
};
