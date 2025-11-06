/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To configure Sonner toast notifications with top-center positioning and custom styling options.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/UserContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import NavbarWrapper from "./components/layout/NavbarWrapper";
import AuthGuard from "./components/layout/AuthGuard";
import TabGuard from "./components/layout/TabGuard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerPrep",
  description: "A collaborative coding platform for interview preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ConnectionProvider>
            <AuthGuard />
            <NavbarWrapper />
            <TabGuard>{children}</TabGuard>
          </ConnectionProvider>
        </UserProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          expand={true}
          duration={4000}
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              padding: "16px",
            },
            className: "toast-custom",
          }}
        />
      </body>
    </html>
  );
}
