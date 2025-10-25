/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude 4 Sonnet), date: 2025-09-15
 * Purpose: To implement comprehensive signup form improvements including controlled inputs,
 *  debounced password validation, password complexity requirements with visual indicators,
 *  and enhanced UX patterns.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Tool: ChatGPT (model: GPT-4.1, date: 2025-09-16)
 * Purpose: To Generate email regex validation
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DebouncedInput } from "@/components/ui/debouncedInput";
import { Eye, EyeOff, UserPlus, AlertCircle, Check, X } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import React, { useState } from "react";
import { toast } from "sonner";
import { signup } from "@/services/userServiceApi";
import { handleApiError, handleApiSuccess } from "@/services/errorHandler";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  //#region states
  // main state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // UI password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  //  password validation states
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  //#endregion

  //#region derived states
  const isPasswordsMatch = password === confirmPassword;
  //#endregion

  //#region regex
  // Password validation regex patterns
  const passwordRegex = {
    length: /.{8,}/, // At least 8 characters
    uppercase: /[A-Z]/, // At least one uppercase letter
    lowercase: /[a-z]/, // At least one lowercase letter
    number: /\d/, // At least one number
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, // At least one special character
  };
  //#endregion

  //#region password methods
  // Check if password meets all requirements
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Handle debounced confirm password validation
  const handleConfirmPasswordChange = (value: string) => {
    // Only show error if both fields have content and they don't match
    if (password && value && password !== value) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  // Handle password change and validate complexity
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validate password complexity
    setPasswordValidation({
      length: passwordRegex.length.test(newPassword),
      uppercase: passwordRegex.uppercase.test(newPassword),
      lowercase: passwordRegex.lowercase.test(newPassword),
      number: passwordRegex.number.test(newPassword),
      special: passwordRegex.special.test(newPassword),
    });

    // Update password match error based on current confirm password value
    if (confirmPassword && newPassword && newPassword !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };
  //#endregion

  //#region other methods
  const onRegister = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoading) return; // Prevent multiple submissions

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    // Specific validation checks with toast messages
    if (!trimmedUsername) {
      toast.error("Username is required!", {
        description: "Please enter a username to continue.",
      });
      return;
    }

    if (!trimmedEmail) {
      toast.error("Email is required!", {
        description: "Please enter your email address.",
      });
      return;
    }

    // check if email format is valid using simple regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      toast.error("Invalid email format!", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    if (!password) {
      toast.error("Password is required!", {
        description: "Please create a password for your account.",
      });
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password doesn't meet requirements!", {
        description: "Please check the password requirements below.",
      });
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password!", {
        description: "Enter your password again to confirm.",
      });
      return;
    }

    if (!isPasswordsMatch) {
      toast.error("Passwords don't match!", {
        description: "Please make sure both password fields are identical.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // sign up using apis - Axios automatically parses JSON
      const response = await signup(trimmedUsername, trimmedEmail, password);

      // Use reusable success handler
      handleApiSuccess(
        response.data.message || "Account created successfully!",
        `Welcome ${response.data.data?.username}! You can now sign in.`,
        response.data.data,
      );

      //Redirect to login after short delay
      setTimeout(() => {
        router.push(
          `/auth/check-email?email=${encodeURIComponent(trimmedEmail)}&username=${encodeURIComponent(trimmedUsername)}`,
        );
      }, 1000);
    } catch (error: unknown) {
      // Use reusable error handler
      handleApiError(error, "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  //#region rendering
  return (
    <Card className="w-[80%] max-w-[500px]">
      {/*Header */}
      <CardHeader className="mt-5">
        <CardTitle className="text-center text-4xl font-bold">
          Register an account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-15 pt-10">
        <form>
          <div className="flex flex-col gap-4">
            {/* Username input */}
            <div>
              <Label className="m-2">Username</Label>
              <Input
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Email input */}
            <div>
              <Label className="m-2">Email</Label>
              <Input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Password input with visibility toggle */}
            <div>
              <Label className="m-2">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {password &&
                    (showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    ))}
                </Button>
              </div>

              {/* Password strength requirements */}
              {(isPasswordFocused || password !== "") && !isPasswordValid && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    Password Requirements:
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div
                      className={`flex items-center ${passwordValidation.length ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.length ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.uppercase ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.uppercase ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      One uppercase letter (A-Z)
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.lowercase ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.lowercase ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      One lowercase letter (a-z)
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.number ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.number ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      One number (0-9)
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.special ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.special ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      One special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password input with visibility toggle */}
            <div>
              <Label className="m-2">Confirm Password</Label>
              <div className="relative">
                <DebouncedInput
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onDebouncedChange={handleConfirmPasswordChange}
                  debounceMs={300}
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {confirmPassword &&
                    (showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    ))}
                </Button>
              </div>

              {/* Password match error message */}
              {passwordMatchError && (
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {passwordMatchError}
                </div>
              )}
            </div>

            {/* Register Button and already have an account*/}
            <div className="flex justify-center mt-4">
              <Button
                className="w-full"
                onClick={onRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4" variant="default" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </div>

            {/* Navigate to login page */}
            <div className="flex justify-center mt-4">
              <div className="text-sm text-muted-foreground">
                Already have an account?
              </div>
              <Link
                href="/auth/login"
                className={`ml-3 ${
                  isLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:underline"
                }`}
                onClick={(e) => isLoading && e.preventDefault()}
              >
                Sign in here
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
  //#endregion
}
