/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To implement simple cookie utilities for JWT token storage and removal, ensuring compatibility with Next.js middleware authentication.
 * Author Review: I validated correctness, security, and performance of the code.
 */

export function addToken(token: string): void {
  document.cookie = `token=${token}; path=/`;
}

export function removeToken(): void {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      return value;
    }
  }
  return null;
}
