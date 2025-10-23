/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To add purpose parameter handling for verification endpoints to support both signup and email change verification.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To implement email change request and verification code generation endpoints.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To add verifyEmailChangeCode function for validating 6-digit codes without sending verification links.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To separate email change and signup verification logic to fix bug where user lookup failed with new email during email change.
 * Author Review: I validated the fix properly handles both verification flows with appropriate user lookup strategies.
 */

import { 
  findUserByUsernameAndEmail as _findUserByUsernameAndEmail,
  findUserById as _findUserById,
  findUserByEmail as _findUserByEmail,
  findUserVerifyRecordByTokenAndId as _findUserVerifyRecordByTokenAndId,
  findUserVerifyRecordByToken as _findUserVerifyRecordByToken,
  updateUserVerificationStatusById as _updateUserVerificationStatusById,
  updateUserEmailById as _updateUserEmailById,
  deleteUserVerifyRecordByUserId as _deleteUserVerifyRecordByUserId,
  createUserVerifyRecord as _createUserVerifyRecord,
  findUserVerifyRecordById as _findUserVerifyRecordById,
  createChangeEmailCodeRecord as _createChangeEmailCodeRecord,
  findChangeEmailCodeByCodeAndUserId as _findChangeEmailCodeByCodeAndUserId,
  deleteChangeEmailCodeByUserId as _deleteChangeEmailCodeByUserId,
} from "../model/repository.js";
import crypto from "crypto";
import { makeVerificationLink, sendVerificationEmail, sendChangeEmailCode, sendEmailChangeWarning } from "../utils/emailSender.js";

export async function verifyUser(req, res) {
  try {
    // extract username, email, token and optional purpose from query params
    const { username, email, token, purpose = 'signup' } = req.query;
    // decode URI components in case of special characters
    const decodedUsername = decodeURIComponent(username);
    const decodedEmail = decodeURIComponent(email);
    const decodedToken = decodeURIComponent(token);

    // check if any fields is missing
    if (!decodedUsername || !decodedEmail || !decodedToken) {
      return res.status(400).json({ message: "Missing username and/or email and/or token" });
    }

    // hash the provided token
    const hashedToken = crypto.createHash("sha256").update(decodedToken).digest("hex");

    // ===== HANDLE EMAIL CHANGE VERIFICATION =====
    // For email change, we need to find user by username and OLD email (not new email)
    // because the user hasn't changed their email yet in the database
    if (purpose === 'email-change') {
      // First, find the verification record by token to get the userId
      // We can't use findUserByUsernameAndEmail with new email because user still has old email
      const userVerifyRecord = await _findUserVerifyRecordByToken(hashedToken);
      if (!userVerifyRecord) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Check if the record purpose matches email-change
      if (userVerifyRecord.purpose !== 'email-change') {
        return res.status(400).json({ message: "Invalid purpose for this verification token" });
      }

      // Check if newEmail exists in the record
      if (!userVerifyRecord.newEmail) {
        return res.status(400).json({ message: "Invalid email change verification record" });
      }

      // Verify that the email in query params matches the newEmail in the record
      if (userVerifyRecord.newEmail.toLowerCase() !== decodedEmail.toLowerCase()) {
        return res.status(400).json({ message: "Email in verification link does not match the new email address" });
      }

      // Find user by ID from the verification record
      const user = await _findUserById(userVerifyRecord.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify username matches
      if (user.username !== decodedUsername) {
        return res.status(400).json({ message: "Username does not match" });
      }

      // Check if user is verified (only verified users can change email)
      if (!user.verified) {
        return res.status(403).json({ message: "Please verify your account first before changing email" });
      }
      
      // Update user's email to the new email
      await _updateUserEmailById(user._id, userVerifyRecord.newEmail);
      
      // Delete the used token
      await _deleteUserVerifyRecordByUserId(user._id);
      
      return res.status(200).json({ message: "Email changed successfully" });
    }

    // ===== HANDLE SIGNUP VERIFICATION =====
    // For signup, user is registering with this email for the first time
    // So we can find user by username and email (current email in database)
    if (purpose === 'signup') {
      // Find user by username and email
      const user = await _findUserByUsernameAndEmail(decodedUsername, decodedEmail);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is already verified
      if (user.verified) {
        return res.status(200).json({ message: "User already verified" });
      }

      // Check if hashed token matches the one in the database
      const userVerifyRecord = await _findUserVerifyRecordByTokenAndId(hashedToken, user._id);
      if (!userVerifyRecord) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Mark user as verified
      await _updateUserVerificationStatusById(user._id, true);

      // Delete the used token
      await _deleteUserVerifyRecordByUserId(user._id);
      
      return res.status(200).json({ message: "User verified successfully" });
    }

    // Invalid purpose
    return res.status(400).json({ message: "Invalid verification purpose" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when verifying user!" });
  }
}

export async function resendVerification(req, res) {  
  try {
    // extract username, email and optional purpose from query params
    const { username, email, purpose = 'signup' } = req.query;
    
    // Only allow resending for signup purpose
    if (purpose !== 'signup') {
      return res.status(403).json({ 
        message: "Resend verification is only available for new account signups. Please log in and request to change your email again." 
      });
    }
    
    // decode URI components in case of special characters
    const decodedUsername = decodeURIComponent(username);
    const decodedEmail = decodeURIComponent(email);
    // check if any fields is missing
    if (!decodedUsername || !decodedEmail) {
      return res.status(400).json({ message: "Missing username and/or email" });
    }
    // find user by username and email
    const user = await _findUserByUsernameAndEmail(decodedUsername, decodedEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if user is already verified and if it is send a clear error message
    if (user.verified) {
      // send error message
      return res.status(400).json({ message: "User already verified" });
    }
    // check if any verification is resend too soon (within 30 seconds)
    const existingRecord = await _findUserVerifyRecordById(user._id);
    if (existingRecord.length > 0) {
      const timeSinceLastSent = Date.now() - new Date(existingRecord[0].createdAt).getTime();
      if (timeSinceLastSent < 30 * 1000) { // 30 seconds
        return res.status(429).json({ message: "Verification email resent too soon. Please wait before trying again." });
      }
    }

    // else, proceed to resend verification email
    // create a new token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // delete any existing tokens for this user
    await _deleteUserVerifyRecordByUserId(user._id);

    // create and save new token with purpose
    await _createUserVerifyRecord(user._id, hashedToken, purpose);

    // create verification link with purpose
    const verifyUrl = makeVerificationLink(user.email, user.username, rawToken, purpose);

    // send verification email
    await sendVerificationEmail(user.email, verifyUrl);
    return res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when resending verification email!" });
  }
}

// POST /verification/request-email-change-code
// Request a 6-digit verification code to change email
export async function requestEmailChangeCode(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // Find user by ID
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your account first before changing email" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing codes for this user
    await _deleteChangeEmailCodeByUserId(userId);

    // Save code to database
    await _createChangeEmailCodeRecord(userId, code);

    // Send code to user's current email
    await sendChangeEmailCode(user.email, userId, user.username, code);

    return res.status(200).json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when requesting email change code!" });
  }
}

// POST /verification/verify-email-change-code
// Verify the 6-digit code for email change without sending verification link
export async function verifyEmailChangeCode(req, res) {
  try {
    const { userId, code } = req.body;

    // Validate required fields
    if (!userId || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by ID
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your account first before changing email" });
    }

    // Verify the 6-digit code
    const codeRecord = await _findChangeEmailCodeByCodeAndUserId(code, userId);
    if (!codeRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    return res.status(200).json({ message: "Verification code is valid" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when verifying email change code!" });
  }
}

// POST /verification/change-email
// Request email change with 6-digit verification code
export async function changeEmail(req, res) {
  try {
    const { userId, username, oldEmail, newEmail, code } = req.body;

    // Validate required fields
    if (!userId || !username || !oldEmail || !newEmail || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by username and old email
    const user = await _findUserByUsernameAndEmail(username, oldEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify userId matches
    if (user._id.toString() !== userId) {
      return res.status(403).json({ message: "User ID mismatch" });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your account first before changing email" });
    }

    // Verify the 6-digit code
    const codeRecord = await _findChangeEmailCodeByCodeAndUserId(code, userId);
    if (!codeRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Check if new email already exists
    const existingUser = await _findUserByEmail(newEmail);
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Delete the used code
    await _deleteChangeEmailCodeByUserId(userId);

    // Create verification token for email change
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Delete any existing verification tokens for this user
    await _deleteUserVerifyRecordByUserId(userId);

    // Create and save new token with email-change purpose and newEmail
    await _createUserVerifyRecord(userId, hashedToken, 'email-change', newEmail);

    // Create verification link with email-change purpose
    const verifyUrl = makeVerificationLink(newEmail, username, rawToken, 'email-change');

    // Send verification email to NEW email address
    await sendVerificationEmail(newEmail, verifyUrl);

    // Send security warning to OLD email address
    await sendEmailChangeWarning(oldEmail, userId, username);

    return res.status(200).json({ message: "Verification email sent to new email address. Please check your email to complete the change." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when changing email!" });
  }
}
