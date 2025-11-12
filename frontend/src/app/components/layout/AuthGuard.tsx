/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To create a simple client-side auth guard that prevents browser back navigation to cached protected pages after logout.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 */

/**
 * Simple client-side auth guard that checks for token on page navigation.
 * This catches cases where browser back button bypasses middleware cache controls.
 */

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/services/userServiceCookies";

export default function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();

  // Check token immediately on mount and pathname changes
  useEffect(() => {
    // Skip auth routes
    if (pathname.startsWith("/auth")) {
      return;
    }

    // Check for token
    const token = getToken();
    if (!token) {
      console.log("AuthGuard: No token found, redirecting to login");
      // Use setTimeout to ensure this runs after render
      setTimeout(() => {
        router.push("/auth/login");
      }, 0);
    }
  }, [pathname, router]);

  // Add popstate listener specifically for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (!pathname.startsWith("/auth")) {
        const token = getToken();
        if (!token) {
          console.log(
            "AuthGuard: No token found on popstate (back/forward), redirecting to login",
          );
          router.push("/auth/login");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname, router]);

  // Add visibility change listener to catch tab switching scenarios
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !pathname.startsWith("/auth")) {
        const token = getToken();
        if (!token) {
          console.log(
            "AuthGuard: No token found on visibility change, redirecting to login",
          );
          router.push("/auth/login");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pathname, router]);

  // Add focus listener for additional protection
  useEffect(() => {
    const handleFocus = () => {
      if (!pathname.startsWith("/auth")) {
        const token = getToken();
        if (!token) {
          console.log(
            "AuthGuard: No token found on focus, redirecting to login",
          );
          router.push("/auth/login");
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [pathname, router]);

  return null; // This component renders nothing
}
