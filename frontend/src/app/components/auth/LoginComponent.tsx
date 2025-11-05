/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To implement controlled state management and password visibility toggle in login component, maintaining consistency with signup component patterns.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/userServiceApi";
import { handleApiError, handleApiSuccess } from "@/services/errorHandler";
import { toast } from "sonner";
import { addToken } from "@/services/userServiceCookies";
import { useUser } from "@/contexts/UserContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await login(email, password);

      // Check if we got a token
      const token =
        response?.data?.data?.accessToken || response?.data?.accessToken;
      if (!token) {
        toast.error("Login failed: No token received");
        return;
      }

      // Store token
      addToken(token);

      // Set user data from the API response
      const userData = response?.data?.data;
      if (userData?.username && userData?.email) {
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
        });
      }

      // Show success message
      handleApiSuccess(
        "Login successful!",
        `Welcome back! Redirecting to homepage...`,
        response.data
      );

      // Use router.replace instead of push for better Docker/Nginx compatibility
      setTimeout(() => {
        toast.dismiss();
        router.replace("/home");
      }, 1000);
    } catch (error) {
      // check if it is error 403 with error "UNVERIFIED_EMAIL" and canResend is true
      // if can redirect to auth/unverified
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error?.response === "object" &&
        error?.response !== null &&
        "data" in error?.response &&
        typeof error?.response?.data === "object" &&
        error?.response?.data !== null &&
        "status" in error?.response &&
        error?.response?.status === 403 &&
        "error" in error?.response?.data &&
        error?.response?.data?.error === "UNVERIFIED_EMAIL" &&
        "canResend" in error?.response?.data &&
        error?.response?.data?.canResend &&
        "username" in error?.response?.data &&
        typeof error?.response?.data?.username === "string" &&
        error?.response?.data?.username
      ) {
        router.push(
          `/auth/unverified?email=${encodeURIComponent(email)}&username=${encodeURIComponent(error?.response?.data?.username)}`
        );
        return;
      }
      console.error("Login error details:", error);
      handleApiError(error, "Login failed");
    }
  };

  return (
    <Card
      className="
      min-h-[50%] 
      min-w-[40%] 
      bg-white/50 
      backdrop-blur-sm 
      border-black
      mb-20"
    >
      <CardHeader className="mt-5">
        <CardTitle className="text-center text-4xl font-bold">
          Welcome to PeerPrep
        </CardTitle>
      </CardHeader>

      <CardContent className="px-15 pt-10">
        <form>
          <div className="flex flex-col gap-4">
            <div>
              <Label className="m-2">Email</Label>
              <Input
                className="border-black"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="m-2">Password</Label>
              <div className="relative">
                <Input
                  className="border-black"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {password &&
                    (showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    ))}
                </Button>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex">
                <div>Do not have an account?</div>
                <Link
                  href="/auth/signup"
                  className="ml-3 text-blue-700 hover:underline"
                >
                  Signup
                </Link>
              </div>
              <Link
                href="/auth/forgot-password"
                className="ml-3 text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
