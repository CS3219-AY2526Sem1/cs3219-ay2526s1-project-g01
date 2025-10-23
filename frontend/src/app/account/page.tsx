/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To create a user account management page with profile settings and password change functionality, matching the design patterns from signup page.
 * Author Review: I validated the implementation follows consistent styling and UX patterns with proper password validation requirements.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To add email change functionality with 6-digit code verification flow and dialog UI.
 * Author Review: I validated the implementation follows proper security patterns with code verification before email change.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DebouncedInput } from "@/components/ui/debouncedInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import {
  updateUsername as updateUsernameApi,
  updateUserPassword,
  requestEmailChangeCode,
  verifyEmailChangeCode,
  changeEmail,
} from "@/services/userServiceApi";
import { handleApiError } from "@/services/errorHandler";
import { getToken } from "@/services/userServiceCookies";

export default function AccountPage() {
  const { user, setUser } = useUser();

  //#region Profile states
  const [username, setUsername] = useState(user?.username || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  //#endregion

  //#region Email change states
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [codeCooldown, setCodeCooldown] = useState(0);
  const [isNewEmailValid, setIsNewEmailValid] = useState(false);
  //#endregion

  //#region Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // UI password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  // Password validation states
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  //#endregion

  //#region Password validation regex
  const passwordRegex = {
    length: /.{8,}/, // At least 8 characters
    uppercase: /[A-Z]/, // At least one uppercase letter
    lowercase: /[a-z]/, // At least one lowercase letter
    number: /\d/, // At least one number
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, // At least one special character
  };
  //#endregion

  //#region Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //#endregion

  //#region Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (codeCooldown > 0) {
      interval = setInterval(() => {
        setCodeCooldown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeCooldown]);
  //#endregion

  //#region Derived states
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordsMatch = newPassword === confirmNewPassword;

  // Profile save button should only be enabled if username changed
  const hasUsernameChanged = username.trim() !== (user?.username || "");
  const canSaveProfile =
    hasUsernameChanged && !isSavingProfile && username.trim() !== "";

  // Password save button should only be enabled if all 3 fields are filled
  const allPasswordFieldsFilled =
    currentPassword && newPassword && confirmNewPassword;
  const canSavePassword = allPasswordFieldsFilled && !isSavingPassword;
  //#endregion

  //#region Email change handlers
  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setNewEmail(email);
    // Validate email format
    setIsNewEmailValid(emailPattern.test(email.trim()));
  };

  const handleOpenEmailDialog = () => {
    setIsEmailDialogOpen(true);
    setVerificationCode("");
    setIsCodeVerified(false);
    setNewEmail("");
    setIsNewEmailValid(false);
  };

  const handleCloseEmailDialog = () => {
    setIsEmailDialogOpen(false);
    setVerificationCode("");
    setIsCodeVerified(false);
    setNewEmail("");
    setIsNewEmailValid(false);
  };

  const handleRequestCode = async () => {
    if (!user?.id || codeCooldown > 0) return;

    const token = getToken();
    if (!token) {
      toast.error("Not authenticated!", {
        description: "Please log in again.",
      });
      return;
    }

    setIsRequestingCode(true);

    try {
      await requestEmailChangeCode(user.id, token);
      toast.success("Verification code sent!", {
        description: "Please check your email for the 6-digit code.",
      });
      setCodeCooldown(30);
    } catch (error: unknown) {
      handleApiError(error, "Failed to send verification code");
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!user?.id || !verificationCode || verificationCode.length !== 6) {
      toast.error("Invalid code!", {
        description: "Please enter a 6-digit verification code.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not authenticated!", {
        description: "Please log in again.",
      });
      return;
    }

    setIsVerifyingCode(true);

    try {
      await verifyEmailChangeCode(user.id, verificationCode, token);
      toast.success("Code verified!", {
        description: "You can now change your email address.",
      });
      setIsCodeVerified(true);
      setIsEmailDialogOpen(false);
    } catch (error: unknown) {
      handleApiError(error, "Invalid or expired verification code");
      setIsCodeVerified(false);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSaveEmailChange = async () => {
    if (!isCodeVerified || !newEmail || !user?.id || !user?.username || !user?.email) {
      toast.error("Invalid request!", {
        description: "Please verify your code and enter a new email.",
      });
      return;
    }

    const trimmedNewEmail = newEmail.trim();

    // Validate email format
    if (!emailPattern.test(trimmedNewEmail)) {
      toast.error("Invalid email format!", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Check if new email is same as current email
    if (trimmedNewEmail.toLowerCase() === user.email.toLowerCase()) {
      toast.error("Email unchanged!", {
        description: "Please enter a different email address.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not authenticated!", {
        description: "Please log in again.",
      });
      return;
    }

    setIsChangingEmail(true);

    try {
      await changeEmail(
        user.id,
        user.username,
        user.email,
        newEmail,
        verificationCode,
        token
      );
      toast.success("Verification email sent!", {
        description: "Please check your new email to complete the change.",
      });
      // Reset all states after successful request
      setIsCodeVerified(false);
      setNewEmail("");
      setVerificationCode("");
      setIsNewEmailValid(false);
    } catch (error: unknown) {
      handleApiError(error, "Failed to change email");
    } finally {
      setIsChangingEmail(false);
    }
  };
  //#endregion

  //#region Password handlers
  // Handle new password change and validate complexity
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validate password complexity
    setPasswordValidation({
      length: passwordRegex.length.test(password),
      uppercase: passwordRegex.uppercase.test(password),
      lowercase: passwordRegex.lowercase.test(password),
      number: passwordRegex.number.test(password),
      special: passwordRegex.special.test(password),
    });

    // Clear error if passwords now match
    if (confirmNewPassword && password === confirmNewPassword) {
      setPasswordMatchError("");
    }
  };

  // Handle debounced confirm password validation
  const handleConfirmNewPasswordChange = (value: string) => {
    // Only show error if both fields have content and they don't match
    if (newPassword && value && newPassword !== value) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };
  //#endregion

  //#region Save handlers
  // Handle profile save
  const handleSaveProfile = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isSavingProfile) return;

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast.error("Username is required!", {
        description: "Please enter a username.",
      });
      return;
    }

    if (!user?.id) {
      toast.error("User not found!", {
        description: "Please log in again.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not authenticated!", {
        description: "Please log in again.",
      });
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await updateUsernameApi(user.id, trimmedUsername, token);

      toast.success("Profile updated successfully!", {
        description: "Your username has been changed.",
      });

      // Update user context with new username
      if (response.data?.data?.username) {
        setUser({
          ...user,
          username: response.data.data.username,
        });
      }
    } catch (error: unknown) {
      handleApiError(error, "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isSavingPassword) return;

    // Validation checks
    if (!currentPassword) {
      toast.error("Current password is required!", {
        description: "Please enter your current password.",
      });
      return;
    }

    if (!newPassword) {
      toast.error("New password is required!", {
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

    if (!confirmNewPassword) {
      toast.error("Please confirm your new password!", {
        description: "Enter your new password again to confirm.",
      });
      return;
    }

    if (!isPasswordsMatch) {
      toast.error("Passwords don't match!", {
        description: "Please make sure both password fields are identical.",
      });
      return;
    }

    if (!user?.id) {
      toast.error("User not found!", {
        description: "Please log in again.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not authenticated!", {
        description: "Please log in again.",
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      await updateUserPassword(user.id, currentPassword, newPassword, token);

      toast.success("Password changed successfully!", {
        description: "Your password has been updated.",
      });

      // Clear password fields after successful change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
    } catch (error: unknown) {
      handleApiError(error, "Failed to change password");
    } finally {
      setIsSavingPassword(false);
    }
  };
  //#endregion

  //#region Render
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Email Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Email Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              {!isCodeVerified ? (
                <Button
                  onClick={handleOpenEmailDialog}
                  variant="outline"
                  className="w-full"
                >
                  Modify Email
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label>New Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Enter new email address"
                    value={newEmail}
                    onChange={handleNewEmailChange}
                    disabled={isChangingEmail}
                    className={newEmail && !isNewEmailValid ? "border-red-500" : ""}
                  />
                  {newEmail && !isNewEmailValid && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Please enter a valid email address
                    </p>
                  )}
                  {newEmail && isNewEmailValid && (
                    <p className="text-sm text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Valid email format
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsCodeVerified(false);
                        setNewEmail("");
                        setVerificationCode("");
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={isChangingEmail}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEmailChange}
                      disabled={!newEmail || !isNewEmailValid || isChangingEmail}
                      className="flex-1"
                    >
                      {isChangingEmail ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4">
                {/* Username field */}
                <div>
                  <Label className="m-2">Username</Label>
                  <Input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSavingProfile}
                  />
                </div>

                {/* Save Changes button */}
                <Button
                  onClick={handleSaveProfile}
                  disabled={!canSaveProfile}
                  className={`w-full ${
                    !canSaveProfile ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4">
                {/* Current Password field with visibility toggle */}
                <div>
                  <Label className="m-2">Current Password</Label>
                  <div className="relative">
                    <Input
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isSavingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      disabled={isSavingPassword}
                    >
                      {currentPassword &&
                        (showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        ))}
                    </Button>
                  </div>
                </div>

                {/* New Password field with visibility toggle */}
                <div>
                  <Label className="m-2">New Password</Label>
                  <div className="relative">
                    <Input
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      onFocus={() => setIsNewPasswordFocused(true)}
                      onBlur={() => setIsNewPasswordFocused(false)}
                      disabled={isSavingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isSavingPassword}
                    >
                      {newPassword &&
                        (showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        ))}
                    </Button>
                  </div>

                  {/* Password strength requirements indicator */}
                  {(isNewPasswordFocused || newPassword !== "") &&
                    !isPasswordValid && (
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

                {/* Confirm New Password field with visibility toggle */}
                <div>
                  <Label className="m-2">Confirm New Password</Label>
                  <div className="relative">
                    <DebouncedInput
                      name="confirmNewPassword"
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      onDebouncedChange={handleConfirmNewPasswordChange}
                      debounceMs={300}
                      disabled={isSavingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      disabled={isSavingPassword}
                    >
                      {confirmNewPassword &&
                        (showConfirmNewPassword ? (
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

                {/* Save Changes button */}
                <Button
                  onClick={handleChangePassword}
                  disabled={!canSavePassword}
                  className={`w-full ${
                    !canSavePassword ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSavingPassword ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Email Change Dialog */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Email Address</DialogTitle>
              <DialogDescription>
                We&apos;ll send a 6-digit verification code to your current email
                address.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Step 1: Request and verify code */}
              <div className="space-y-4">
                <div>
                  <Label>Verification Code</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setVerificationCode(value);
                      }}
                      maxLength={6}
                      disabled={isCodeVerified || isVerifyingCode}
                      className="flex-1"
                    />
                    {!isCodeVerified && (
                      <Button
                        onClick={handleVerifyCode}
                        disabled={verificationCode.length !== 6 || isVerifyingCode}
                        variant="outline"
                      >
                        {isVerifyingCode ? "Verifying..." : "Verify"}
                      </Button>
                    )}
                  </div>
                  {isCodeVerified && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Code verified successfully
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleRequestCode}
                  disabled={codeCooldown > 0 || isRequestingCode || isCodeVerified}
                  variant="secondary"
                  className="w-full"
                >
                  {isRequestingCode
                    ? "Sending..."
                    : codeCooldown > 0
                      ? `Request Code (${codeCooldown}s)`
                      : "Request Code"}
                </Button>
              </div>

              {/* Step 2: Enter new email (only after code verified) - Note: This is hidden since we moved email input to card */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
  //#endregion
}
