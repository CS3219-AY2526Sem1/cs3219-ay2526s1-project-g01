/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To implement simple cookie utilities for JWT token storage and removal, ensuring compatibility with Next.js middleware authentication.
 * Author Review: I validated correctness, security, and performance of the code.
 */

export function addToken(token: string): void {
  // Detect if running in production (HTTPS) environment
  const isProduction = window.location.protocol === 'https:';
  const isGoogleCloud = window.location.hostname.includes('run.app');
  
  console.log('Setting token cookie, production:', isProduction, 'GCP:', isGoogleCloud, 'domain:', window.location.hostname);
  
  // Build cookie options based on environment
  const cookieOptions = [
    `token=${token}`, // Set the token value
    'path=/', // Make cookie available site-wide
    // For Google Cloud Run: Need SameSite=None and Secure for cross-origin requests through API gateway
    // For local/other: Use SameSite=Lax for better compatibility
    ...(isGoogleCloud && isProduction ? ['Secure', 'SameSite=None'] : ['SameSite=Lax'])
  ];
  
  // Set the cookie with all options
  document.cookie = cookieOptions.join('; ');
  
  // Verify cookie was set
  console.log('Cookie set, verification:', document.cookie.includes('token='));
  console.log('All cookies:', document.cookie);
}

export function removeToken(): void {
  // Detect if running in production (HTTPS) environment
  const isProduction = window.location.protocol === 'https:';
  const isGoogleCloud = window.location.hostname.includes('run.app');
  
  // Build cookie deletion options - must match the same attributes as when cookie was set
  const cookieOptions = [
    'token=', // Clear the token value
    'path=/', // Same path as when cookie was set
    'expires=Thu, 01 Jan 1970 00:00:00 UTC', // Set expiry to past date to delete
    // Use same SameSite setting as addToken for proper deletion
    ...(isGoogleCloud && isProduction ? ['Secure', 'SameSite=None'] : ['SameSite=Lax'])
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
