/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To implement conditional navbar rendering that hides navigation on authentication pages using Next.js pathname detection.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Don't show navbar on auth pages
  const isAuthPage = pathname.startsWith("/auth");
  const isCollabPage = pathname.startsWith("/collab");

  if (isAuthPage || isCollabPage) {
    return null;
  }

  return <Navbar />;
}
