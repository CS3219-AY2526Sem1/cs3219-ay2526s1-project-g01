/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-24
 * Purpose: To update login functionality to check user verification status before allowing authentication.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
  findUserByEmail as _findUserByEmail,  
  createPasswordResetRecord as _createPasswordResetRecord,
  findPasswordResetRecordById as _findPasswordResetRecordById,
  findPasswordResetRecordByTokenAndId as _findPasswordResetRecordByTokenAndId,
  deletePasswordResetRecordByUserId as _deletePasswordResetRecordByUserId,
  updateUserPasswordById as _updateUserPasswordById,
} from "../model/repository.js";
import { formatUserResponse } from "./user-controller.js";
import crypto from "crypto";
import {
  makeResetPasswordLink,
  sendResetPasswordEmail
} from "../utils/emailSender.js";

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const user = await _findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Wrong email and/or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Wrong email and/or password" });
      }

      // Check if user is verified
      if (!user.verified) {
        return res.status(403).json({
          error: "UNVERIFIED_EMAIL",
          canResend: true,
          username: user.username
        });
      }

      const accessToken = jwt.sign({
        id: user.id,
      }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).json({ message: "User logged in", data: { accessToken, ...formatUserResponse(user) } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: "Missing email and/or password" });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    const verifiedUser = req.user;
    return res.status(200).json({ message: "Token verified", data: verifiedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function handleRequestPasswordReset(req, res) {
  try {
    const { email } = req.body ?? {};
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await _findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User with given email not found" });
    }

    // check if user is verified
    if (!user.verified) {
      return res.status(403).json({
        error: "UNVERIFIED_EMAIL",
        canResend: true,
        username: user.username,
        message: "User email is not verified. Please verify your email before resetting password."
      });
    }

    // check if a password reset token already exists for this user 
    // and check if it is less than 30 seconds ago
    const resetRecord = await _findPasswordResetRecordById(user._id);
    if (resetRecord.length > 0) {
      const now = Date.now();
      const elapsed = now - (new Date(resetRecord[0].createdAt)).getTime();
      if (elapsed < 30000) { // 30 seconds
        return res.status(429).json({ message: "Password reset already requested recently. Please wait before requesting again." });
      }
    }

    // create a password reset token and store it
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // delete any existing tokens for this user
    await _deletePasswordResetRecordByUserId(user._id);

    // store the new token
    await _createPasswordResetRecord(user._id, hashedToken);

    // create password reset link
    const resetUrl = makeResetPasswordLink(user.email, user.username, rawToken);

    // send the password reset email
    await sendResetPasswordEmail(user.email, resetUrl);
    return res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function handleValidatePasswordResetToken(req, res) {
  try {
    // extract username, email and token from query params
    const { username, email, token } = req.query;

    // decode URI components in case of special characters
    const decodedUsername = decodeURIComponent(username || "");
    const decodedEmail = decodeURIComponent(email || "");
    const decodedToken = decodeURIComponent(token || "");

    // check if any fields is missing
    if (!decodedUsername || !decodedEmail || !decodedToken) {
      return res.status(400).json({ message: "Missing username and/or email and/or token" });
    }

    // find user by email
    const user = await _findUserByEmail(decodedEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if username matches
    if (user.username !== decodedUsername) {
      return res.status(400).json({ message: "Invalid username for this email" });
    }

    // hash the provided token
    const hashedToken = crypto.createHash("sha256").update(decodedToken).digest("hex");

    // check if hashed token matches the one in the database
    const passwordResetRecord = await _findPasswordResetRecordByTokenAndId(hashedToken, user._id);
    if (!passwordResetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    return res.status(200).json({ message: "Token is valid" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when validating token!" });
  }
}

export async function handleConfirmPasswordReset(req, res) {
  try {
    // extract username, email and token from query params
    const { username, email, token } = req.query;
    // extract new password from request body
    const { newPassword } = req.body ?? {};

    // decode URI components in case of special characters
    const decodedUsername = decodeURIComponent(username);
    const decodedEmail = decodeURIComponent(email);
    const decodedToken = decodeURIComponent(token);

    // check if any fields is missing
    if (!decodedUsername || !decodedEmail || !decodedToken || !newPassword) {
      return res.status(400).json({ message: "Missing username and/or email and/or token and/or newPassword" });
    }

    // validate password strength (similar to signup)
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // find user by username and email
    const user = await _findUserByEmail(decodedEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if username matches
    if (user.username !== decodedUsername) {
      return res.status(400).json({ message: "Invalid username for this email" });
    }

    // hash the provided token
    const hashedToken = crypto.createHash("sha256").update(decodedToken).digest("hex");

    // check if hashed token matches the one in the database
    const passwordResetRecord = await _findPasswordResetRecordByTokenAndId(hashedToken, user._id);
    if (!passwordResetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // update user password
    await _updateUserPasswordById(user._id, hashedPassword);

    // delete the used token
    await _deletePasswordResetRecordByUserId(user._id);

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when resetting password!" });
  }
}
