/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-23
 * Purpose: To create an email verification check page shown after signup, with logo display and resend functionality, maintaining visual consistency with auth page layouts.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-24
 * Purpose: To fix Next.js 15 production build issues by replacing useSearchParams with window.location URLSearchParams for client-side URL parameter parsing.
 * Author Review: I validated the solution works in both development and production builds, maintaining the same functionality while avoiding Suspense boundary requirements.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { resendEmailVerification } from "@/services/userServiceApi";

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Extract query parameters on mount using window.location (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email") || "";
      const usernameParam = params.get("username") || "";
      setEmail(emailParam);
      setUsername(usernameParam);
    }
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsResending(true);
    setCanResend(false);

    try {
      await resendEmailVerification(username, email);

      toast.success("Verification email sent!", {
        description: "Please check your email inbox and spam folder.",
      });

      // Start 30-second cooldown
      setCooldownSeconds(30);
    } catch (error: unknown) {
      console.error("Resend email error:", error);
      // Only allow retry on error if not rate limited (error code !== 429)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status !== 429) {
        toast.error("Failed to resend email", {
          description: "Please try again later.",
        });
        setCanResend(true);
      } else {
        toast.error("An email was recently sent", {
          description: "Please wait before trying again.",
        });
        setCooldownSeconds(30); // Enforce cooldown on rate limit
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login/login-1.jpg')" }}
    >
      <Image
        src="/PeerPrepLogo.png"
        alt="PeerprepLogo"
        width={200}
        height={200}
      />

      <Card className="min-h-[40%] min-w-[40%] mt-3 mb-20 bg-white/30 backdrop-blur-sm border-black">
        <CardHeader className="mt-5">
          <CardTitle className="text-center text-3xl font-bold">
            Check Your Email
          </CardTitle>
        </CardHeader>

        <CardContent className="px-15 pt-2 text-center">
          <div className="flex flex-col gap-6">
            <p className="text-lg text-black">
              A verification link has been sent to your email. Please check your
              inbox to verify your account.
            </p>

            <p className="text-sm text-black">
              Didn&apos;t receive the email? Check your spam folder or request a
              new one.
            </p>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending || !canResend}
                className="w-full"
              >
                {isResending
                  ? "Sending..."
                  : !canResend
                    ? `Resend in ${cooldownSeconds}s`
                    : "Resend Verification Email"}
              </Button>

              <Link
                href="/auth/login"
                className="text-blue-700 hover:underline text-sm"
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
