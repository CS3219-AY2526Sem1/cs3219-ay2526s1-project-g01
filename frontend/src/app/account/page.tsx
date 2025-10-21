/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To create a user account management page with profile settings and password change functionality, matching the design patterns from signup page.
 * Author Review: I validated the implementation follows consistent styling and UX patterns with proper password validation requirements.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DebouncedInput } from "@/components/ui/debouncedInput";
import { Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import {
  updateUsername as updateUsernameApi,
  updateUserPassword,
} from "@/services/userServiceApi";
import { handleApiError } from "@/services/errorHandler";
import { getToken } from "@/services/userServiceCookies";

export default function AccountPage() {
  const { user, setUser } = useUser();

  //#region Profile states
  const [username, setUsername] = useState(user?.username || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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
            <div>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-2">
                Email address cannot be changed at this time.
              </p>
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
      </div>
    </div>
  );
  //#endregion
}
