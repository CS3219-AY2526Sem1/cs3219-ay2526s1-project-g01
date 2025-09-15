/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude 3.5 Sonnet), date: 2025-09-15
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
import  { addToken } from "@/services/userServiceCookies";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  
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
      const token = response?.data?.data?.accessToken || response?.data?.accessToken;
      if (!token) {
        toast.error("Login failed: No token received");
        return;
      }

      // Store token and show success
      addToken(token);
      handleApiSuccess(
        "Login successful!", 
        `Welcome back! Redirecting to homepage...`,
        response.data
      );

      // Redirect after short delay
      setTimeout(() => {
        router.push("/home");
      }, 1000);

    } catch (error) {
      console.error('Login error details:', error);
      handleApiError(error, "Login failed");
    }
  };

  return (
    <Card className="min-h-[50%] min-w-[40%]">
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
                  {password && (showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  ))}
                </Button>
              </div>
            </div>

            <div className="flex justify-center ">
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>

            <div className="flex">
              <div>Do not have an account?</div>
              <Link
                href="/auth/signup"
                className="ml-3 text-blue-500 hover:underline"
              >
                Signup
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
