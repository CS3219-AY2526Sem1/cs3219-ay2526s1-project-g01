/**
 * Complete client-side authentication guard
 * Handles all token checking and verification since middleware is disabled
 */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken, removeToken } from "@/services/userServiceCookies";
import { verifyToken } from "@/services/userServiceApi";
import { useUser } from "@/contexts/UserContext";

export default function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const verificationRef = useRef<Promise<void> | null>(null);

  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = !isAuthRoute && pathname !== "/" && !pathname.startsWith("/api");

  const performAuthCheck = useCallback(async () => {
    // Skip if already checking or not a protected route
    if (isChecking || !isProtectedRoute) {
      return;
    }

    // Prevent multiple simultaneous checks
    if (verificationRef.current) {
      return verificationRef.current;
    }

    console.log("AuthGuard: Starting auth check for:", pathname);
    setIsChecking(true);

    const checkPromise = (async () => {
      try {
        const token = getToken();
        
        if (!token) {
          console.log("AuthGuard: No token found, redirecting to login");
          removeToken(); // Clean up any stale cookies
          router.replace("/auth/login");
          return;
        }

        console.log("AuthGuard: Token found, verifying with backend...");
        const response = await verifyToken(token);

        if (response.status === 200 && response.data?.data) {
          console.log("AuthGuard: Token verified successfully");
          // Update user context with verified data
          setUser({
            username: response.data.data.username,
            email: response.data.data.email,
          });
        } else {
          console.log("AuthGuard: Token verification failed, status:", response.status);
          removeToken();
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("AuthGuard: Token verification error:", error);
        removeToken();
        router.replace("/auth/login");
      } finally {
        setIsChecking(false);
        verificationRef.current = null;
      }
    })();

    verificationRef.current = checkPromise;
    return checkPromise;
  }, [isChecking, isProtectedRoute, pathname, router, setUser]);

  // Main auth check on route changes
  useEffect(() => {
    performAuthCheck();
  }, [performAuthCheck]);

  // Check on browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      console.log("AuthGuard: Browser navigation detected");
      performAuthCheck();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [performAuthCheck]);

  // Check when page becomes visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("AuthGuard: Page became visible, checking auth");
        performAuthCheck();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [performAuthCheck]);

  // Check when window gets focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("AuthGuard: Window focused, checking auth");
      performAuthCheck();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [performAuthCheck]);

  return null; // This component renders nothing
}
