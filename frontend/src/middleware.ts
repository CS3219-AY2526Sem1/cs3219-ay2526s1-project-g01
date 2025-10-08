/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To fix a bug where users can navigate back to protected pages after logout by implementing cache control headers in middleware.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/services/userServiceApi";

// Middleware to protect routes and verify JWT token
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Try multiple ways to get the token from cookies
  let token = request.cookies.get("token")?.value;
  
  // Fallback: manually parse cookies if NextRequest method fails
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map(c => c.trim());
      const tokenCookie = cookies.find(c => c.startsWith("token="));
      if (tokenCookie) {
        token = tokenCookie.split("=")[1];
      }
    }
  }
  
  console.log("Middleware: Path:", pathname, "Token found:", !!token);
  
  const isAuthRoute = pathname.startsWith("/auth");

  // Allow static files (images, icons, etc.)
  const isStaticFile = /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(pathname);
  if (isStaticFile) {
    return NextResponse.next();
  }

  // Allow access to auth routes without token
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    console.log("Middleware: No token found, redirecting to login");
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    console.log("Middleware: Found token, verifying...");
    // Verify token with backend
    const response = await verifyToken(token);

    if (response.status !== 200) {
      console.log("Middleware: Token verification failed, status:", response.status);
      // Token is invalid, redirect to login but don't clear cookie immediately
      // Let the client handle cookie clearing to avoid interference
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log("Middleware: Token verified successfully");
    // Token is valid, allow access but add cache control headers
    const response_next = NextResponse.next();

    // Prevent browser caching of protected pages to avoid back navigation issues
    response_next.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
    response_next.headers.set("Pragma", "no-cache");
    response_next.headers.set("Expires", "0");

    return response_next;
  } catch (error) {
    console.error("Middleware: Token verification error:", error);
    // On verification error, redirect to login but don't clear cookie
    // This could be a temporary network issue, let client handle it
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (authentication routes)
     * - api (API routes)
     * - _next (Next.js internals)
     * - favicon.ico
     */
    "/((?!auth|api|_next|favicon.ico).*)",
  ],
};
