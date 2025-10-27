/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To create a forgot password page with email input, reset link sending functionality, and proper error handling including 429 rate limiting with 30-second cooldown.
 * Author Review: I validated the implementation follows the same patterns as the unverified page with proper state management, cooldown timer, and error handling.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "@/services/userServiceApi";
import { handleApiError } from "@/services/errorHandler";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [canSend, setCanSend] = useState(true);

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCanSend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleSendResetEmail = async () => {
    if (!canSend) return;

    // Basic email validation
    if (!email) {
      toast.error("Email is required", {
        description: "Please enter your email address.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsSending(true);
    setCanSend(false);

    try {
      await sendPasswordResetEmail(email);

      toast.success("Password reset email sent!", {
        description: "Please check your email inbox and spam folder.",
      });

      // Start 30-second cooldown
      setCooldownSeconds(30);
    } catch (error: unknown) {
      console.error("Send reset email error:", error);

      // Handle rate limiting (429 error) - keep custom logic for cooldown
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status === 429) {
        toast.error("An email was recently sent", {
          description: "Please wait before trying again.",
        });
        setCooldownSeconds(30); // Enforce cooldown on rate limit
      }
      // Use error handler for all other errors
      else {
        handleApiError(error);
        setCanSend(true);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login/login-1.jpg')" }}
    >
      <Image
        src="/PeerPrepLogo.png"
        alt="PeerprepLogo"
        width={200}
        height={200}
      />

      <Card className="min-h-[40%] min-w-[40%] mt-3 mb-20 bg-white/50 backdrop-blur-sm border-black">
        <CardHeader className="mt-5">
          <CardTitle className="text-center text-3xl font-bold">
            Forgot Password?
          </CardTitle>
        </CardHeader>

        <CardContent className="px-15 pt-2">
          <div className="flex flex-col gap-6">
            <p className="text-center text-black">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <div>
              <Label className="m-2">Email</Label>
              <Input
                className="border-black"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleSendResetEmail}
                disabled={isSending || !canSend}
                className="w-full"
              >
                {isSending
                  ? "Sending..."
                  : !canSend
                    ? `Resend in ${cooldownSeconds}s`
                    : "Send Reset Link"}
              </Button>

              <Link
                href="/auth/login"
                className="text-center text-blue-500 hover:underline text-sm"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
