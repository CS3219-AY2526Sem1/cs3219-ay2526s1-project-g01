/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To implement simple cookie utilities for JWT token storage and removal, ensuring compatibility with Next.js middleware authentication.
 * Author Review: I validated correctness, security, and performance of the code.
 */

export function addToken(token: string): void {
  // Detect if running in production (HTTPS) environment
  const isProduction = window.location.protocol === 'https:';
  
  // Build cookie options based on environment
  const cookieOptions = [
    `token=${token}`, // Set the token value
    'path=/', // Make cookie available site-wide
    // Production (HTTPS): Use Secure flag and SameSite=None for cross-origin requests
    // Development (HTTP): Use SameSite=Lax for better security without breaking functionality
    ...(isProduction ? ['Secure', 'SameSite=None'] : ['SameSite=Lax'])
  ];
  
  // Set the cookie with all options
  document.cookie = cookieOptions.join('; ');
}

export function removeToken(): void {
  // Detect if running in production (HTTPS) environment
  const isProduction = window.location.protocol === 'https:';
  
  // Build cookie deletion options - must match the same attributes as when cookie was set
  const cookieOptions = [
    'token=', // Clear the token value
    'path=/', // Same path as when cookie was set
    'expires=Thu, 01 Jan 1970 00:00:00 UTC', // Set expiry to past date to delete
    // Use same SameSite and Secure settings as addToken for proper deletion
    ...(isProduction ? ['Secure', 'SameSite=None'] : ['SameSite=Lax'])
  ];
  
  // Delete the cookie by setting it with past expiry date
  document.cookie = cookieOptions.join('; ');
}

export function getToken(): string | null {
  // Return null if running server-side (no document object)
  if (typeof document === "undefined") return null;

  // Parse all cookies from document.cookie string
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    // Split each cookie into name and value
    const [name, value] = cookie.trim().split("=");
    // Find the token cookie and return its value
    if (name === "token") {
      return value;
    }
  }
  // Return null if token cookie not found
  return null;
}
