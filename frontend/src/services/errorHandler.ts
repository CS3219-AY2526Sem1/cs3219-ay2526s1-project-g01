/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To implement reusable error handling utilities for consistent API error management and user feedback across the application.
 * Author Review: I validated correctness, security, and performance of the code.
 */

/**
 * Utility functions for handling API errors consistently across the application
 */

import { toast } from "sonner";

// Type definitions for error handling
export interface ErrorResponse {
  message: string;
  status?: number;
  type: "server" | "network" | "unknown";
}

/**
 * Extracts error information from different types of errors
 * @param error - The caught error object
 * @returns Normalized error information
 */
export function extractErrorInfo(error: unknown): ErrorResponse {
  // Handle Axios errors
  if (error && typeof error === "object" && "response" in error) {
    // Server responded with error status (400, 409, 500, etc.)
    const axiosError = error as {
      response: {
        status: number;
        data?: { message?: string };
      };
    };

    return {
      message: axiosError.response.data?.message || "Server error occurred",
      status: axiosError.response.status,
      type: "server",
    };
  }

  // Handle network errors (no response received)
  if (error && typeof error === "object" && "request" in error) {
    return {
      message: "Unable to connect to server. Please check your connection.",
      type: "network",
    };
  }

  // Handle other errors
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    message: errorMessage,
    type: "unknown",
  };
}

/**
 * Displays appropriate toast notification based on error type
 * @param error - The caught error object
 * @param customTitle - Optional custom title for the toast
 * @param customDescription - Optional custom description override
 */
export function handleApiError(
  error: unknown,
  customTitle?: string,
  customDescription?: string,
): void {
  console.error("API Error:", error);

  const errorInfo = extractErrorInfo(error);

  // Dismiss any existing loading toasts
  toast.dismiss();

  // Determine toast title and description
  let title = customTitle;
  const description = customDescription || errorInfo.message;

  // Set default titles based on error type if not provided
  if (!title) {
    switch (errorInfo.type) {
      case "server":
        title = getServerErrorTitle(errorInfo.status);
        break;
      case "network":
        title = "Connection Error";
        break;
      default:
        title = "Error";
        break;
    }
  }

  // Show toast notification
  toast.error(title, {
    description: description,
  });
}

/**
 * Gets appropriate title for server errors based on status code
 * @param status - HTTP status code
 * @returns Appropriate error title
 */
function getServerErrorTitle(status?: number): string {
  if (!status) return "Server Error";

  switch (status) {
    case 400:
      return "Invalid Request";
    case 401:
      return "Authentication Required";
    case 403:
      return "Access Denied";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    case 422:
      return "Validation Error";
    case 429:
      return "Too Many Requests";
    case 500:
      return "Server Error";
    case 502:
      return "Service Unavailable";
    case 503:
      return "Service Unavailable";
    default:
      return "Server Error";
  }
}

/**
 * Handles API success responses with consistent toast notifications
 * @param message - Success message from API or custom message
 * @param description - Optional description
 * @param userData - Optional user data to include in message
 */
export function handleApiSuccess(
  message: string,
  description?: string,
  userData?: { username?: string },
): void {
  // Dismiss any existing loading toasts
  toast.dismiss();

  // Enhance description with user data if available
  let finalDescription = description;
  if (userData?.username && !description) {
    finalDescription = `Welcome ${userData.username}!`;
  }

  toast.success(message, {
    description: finalDescription,
  });
}

/**
 * Higher-order function that wraps async operations with error handling
 * @param operation - The async operation to execute
 * @param errorTitle - Custom error title
 * @param successMessage - Custom success message
 * @returns Promise that handles errors automatically
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorTitle?: string,
  successMessage?: string,
): Promise<T | null> {
  try {
    const result = await operation();

    if (successMessage) {
      toast.success(successMessage);
    }

    return result;
  } catch (error) {
    handleApiError(error, errorTitle);
    return null;
  }
}
