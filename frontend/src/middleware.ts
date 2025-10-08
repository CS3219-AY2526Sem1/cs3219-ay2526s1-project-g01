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
  const token = request.cookies.get("token")?.value;
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
    const loginUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(loginUrl);

    // Clear any existing token cookie to ensure clean state
    response.cookies.set("token", "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
  }

  try {
    // Verify token with backend
    const response = await verifyToken(token);

    if (response.status !== 200) {
      // Token is invalid, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);

      // Clear invalid token cookie
      redirectResponse.cookies.set("token", "", {
        path: "/",
        expires: new Date(0),
      });

      return redirectResponse;
    }

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
    console.error("Token verification failed:", error);
    // On error, redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);

    // Clear potentially corrupted token cookie
    redirectResponse.cookies.set("token", "", {
      path: "/",
      expires: new Date(0),
    });

    return redirectResponse;
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
