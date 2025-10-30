/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To create a password reset page that validates reset tokens, displays password input fields with strength validation, and handles password reset confirmation.
 * Author Review: I validated the implementation follows security best practices with proper token validation, password strength requirements, and comprehensive error handling.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DebouncedInput } from "@/components/ui/debouncedInput";
import { Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  validatePasswordResetToken,
  confirmPasswordReset,
} from "@/services/userServiceApi";
import { handleApiError } from "@/services/errorHandler";

export default function ResetPasswordPage() {
  //#region Init
  const router = useRouter();

  // Extract query parameters from URL using window.location
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
      setUsername(params.get("username") || "");
      setToken(params.get("token") || "");
    }
  }, []);
  //#endregion Init

  //#region Token Validation State
  // Token validation state
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  //#endregion Token Validation State

  //#region Password State/ const
  // Password form states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // UI password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Password validation states
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Password validation regex patterns (same as signup)
  const passwordRegex = {
    length: /.{8,}/, // At least 8 characters
    uppercase: /[A-Z]/, // At least one uppercase letter
    lowercase: /[a-z]/, // At least one lowercase letter
    number: /\d/, // At least one number
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, // At least one special character
  };

  // Check if password meets all requirements
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordsMatch = password === confirmPassword;
  //#endregion Password State/ const

  //#region On Mount trigger
  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      // Wait for parameters to be extracted from URL
      if (!email && !username && !token) {
        return; // Still loading parameters
      }

      // Check if required parameters are present
      if (!email || !username || !token) {
        setTokenError("Invalid reset link. Missing required parameters.");
        setIsTokenValid(false);
        setIsValidatingToken(false);
        return;
      }

      try {
        // Call API to validate the token
        await validatePasswordResetToken(username, email, token);
        setIsTokenValid(true);
        setTokenError("");
      } catch (error: unknown) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        setTokenError("Token is invalid or has expired.");
        handleApiError(error);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [email, username, token]);
  //#endregion On Mount trigger

  //#region Handlers
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

  // Handle debounced confirm password validation
  const handleConfirmPasswordChange = (value: string) => {
    // Only show error if both fields have content and they don't match
    if (password && value && password !== value) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  // Handle password reset submission
  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isResetting) return; // Prevent multiple submissions

    // Validation checks
    if (!password) {
      toast.error("Password is required!", {
        description: "Please enter a new password for your account.",
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

    setIsResetting(true);

    try {
      // Call API to confirm password reset
      const response = await confirmPasswordReset(
        username,
        email,
        token,
        password,
      );

      toast.success(response.data.message || "Password reset successfully!", {
        description: "You can now log in with your new password.",
      });

      // Redirect to login after short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      handleApiError(error, "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };
  //#endregion Handlers

  //#region Render Loading
  // Render loading spinner while validating token
  if (isValidatingToken) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/login/login-1.jpg')" }}
      >
        {/* Logo */}
        <Image
          src="/PeerPrepLogo.png"
          alt="PeerPrep Logo"
          width={200}
          height={200}
        />

        {/* Loading card */}
        <Card className="min-h-[40%] min-w-[40%] mt-8 bg-white/50 backdrop-blur-sm border-black">
          <CardHeader className="mt-5">
            <CardTitle className="text-center text-3xl font-bold">
              Validating Reset Link
            </CardTitle>
          </CardHeader>

          <CardContent className="px-15 pt-10 text-center">
            <div className="flex flex-col gap-6 items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

              <p className="text-lg text-gray-600">
                Please wait while we validate your password reset link...
              </p>

              <p className="text-sm text-gray-500">
                This may take a few moments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  //endregion Render Loading

  //#region Render Invalid
  // Render error message if token is invalid
  if (!isTokenValid) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/login/login-1.jpg')" }}
      >
        {/* Logo */}
        <Image
          src="/PeerPrepLogo.png"
          alt="PeerPrep Logo"
          width={200}
          height={200}
        />

        {/* Error card */}
        <Card className="min-h-[40%] min-w-[40%] mt-3 bg-white/50 backdrop-blur-sm border-black">
          <CardHeader className="mt-5">
            <CardTitle className="text-center text-3xl font-bold text-red-600">
              Reset Link Invalid
            </CardTitle>
          </CardHeader>

          <CardContent className="px-15 pt-2 text-center">
            <div className="flex flex-col gap-6">
              {/* Error message */}
              <p className="text-lg text-gray-600">
                {tokenError ||
                  "The password reset link is invalid or has expired."}
              </p>

              <p className="text-sm text-gray-500">
                Please request a new password reset link or contact support if
                the problem persists.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col gap-4">
                <Link href="/auth/forgot-password" className="w-full">
                  <Button className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition-colors hover:bg-gray-800">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link
                  href="/auth/login"
                  className="text-blue-500 hover:underline text-sm"
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
  //endregion Render Invalid

  //#region Render Valid
  // Render password reset form if token is valid
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login/login-1.jpg')" }}
    >
      {/* Logo */}
      <Image
        src="/PeerPrepLogo.png"
        alt="PeerPrep Logo"
        width={200}
        height={200}
      />

      {/* Password reset form card */}
      <Card className="min-h-[40%] min-w-[40%] mt-3 bg-white/50 backdrop-blur-sm border-black">
        <CardHeader className="mt-5">
          <CardTitle className="text-center text-3xl font-bold">
            Reset Password
          </CardTitle>
        </CardHeader>

        <CardContent className="px-15 pt-2">
          <form>
            <div className="flex flex-col gap-4">
              {/* Display username and email (read-only) */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Username:{" "}
                    </span>
                    <span className="text-sm text-gray-900">{username}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Email:{" "}
                    </span>
                    <span className="text-sm text-gray-900">{email}</span>
                  </div>
                </div>
              </div>

              {/* New password input with visibility toggle */}
              <div>
                <Label className="m-2">New Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    disabled={isResetting}
                    required
                  />
                  {/* Toggle password visibility button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isResetting}
                  >
                    {password &&
                      (showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      ))}
                  </Button>
                </div>

                {/* Password strength requirements indicator */}
                {(isPasswordFocused || password !== "") && !isPasswordValid && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Password Requirements:
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {/* Length requirement */}
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
                      {/* Uppercase requirement */}
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
                      {/* Lowercase requirement */}
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
                      {/* Number requirement */}
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
                      {/* Special character requirement */}
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

              {/* Confirm password input with visibility toggle */}
              <div>
                <Label className="m-2">Confirm New Password</Label>
                <div className="relative">
                  <DebouncedInput
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onDebouncedChange={handleConfirmPasswordChange}
                    debounceMs={300}
                    disabled={isResetting}
                    required
                  />
                  {/* Toggle confirm password visibility button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isResetting}
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

              {/* Submit button and back to login link */}
              <div className="flex flex-col gap-4 mt-4">
                <Button
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="w-full"
                >
                  {isResetting ? "Resetting Password..." : "Reset Password"}
                </Button>

                <Link
                  href="/auth/login"
                  className="text-center text-blue-500 hover:underline text-sm"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
  //#endregion Render Valid
}
