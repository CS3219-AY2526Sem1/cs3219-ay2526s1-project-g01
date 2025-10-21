/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-24
 * Purpose: To update user creation with email verification functionality and proper error handling for email sending failures.
 * Author Review: I validated correctness, security, and performance of the code.
 * 
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To add separate controller functions for updating user password and username with proper validation.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
  updateUserPasswordById as _updateUserPasswordById,
  updateUsernameById as _updateUsernameById,
  createUserVerifyRecord as _createUserVerifyRecord,
  deleteUserVerifyRecordByUserId as _deleteUserVerifyRecordByUserId,
} from "../model/repository.js";
import { makeVerificationLink, sendVerificationEmail } from "../utils/emailSender.js";
import { verifyEmailExists } from "../utils/emailVerifier.js";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (username && email && password) {
      let existingUser = await _findUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      existingUser = await _findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Verify email existence
      const emailVerificationResult = await verifyEmailExists(email);
      if (emailVerificationResult.status === 'invalid') {
        return res.status(400).json({ message: "Email address does not exist" });
      }

      // note we cannot reject when it is unknow because some email servers do not respond properly
      // for example, u.nus.edu block external SMTP probes
      // so we have to let them pass because overzealous blocking is a bug
      if (emailVerificationResult.status === 'unknown') {
        console.warn(`Email verification returned unknown status for ${email}: ${emailVerificationResult.reason}`);
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await _createUser(username, email, hashedPassword);
      
      try {
        // Create verification token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        
        // Save verification token to database
        await _createUserVerifyRecord(createdUser._id, hashedToken);
        
        // Create verification link
        const verifyUrl = makeVerificationLink(createdUser.email, createdUser.username, rawToken);
        
        // Send verification email
        await sendVerificationEmail(createdUser.email, verifyUrl);
        
        return res.status(201).json({
          message: `Created new user ${username} successfully. Please check your email for verification.`,
          data: formatUserResponse(createdUser),
        });
      } catch (emailError) {
        // If email sending fails, clean up the created user
        console.error("Email sending failed:", emailError);
        await _deleteUserById(createdUser._id);
        await _deleteUserVerifyRecordByUserId(createdUser._id);
        return res.status(500).json({ message: "Failed to send verification email. Please try again." });
      }
    } else {
      return res
        .status(400)
        .json({ message: "username and/or email and/or password are missing" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when creating new user!" });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    } else {
      return res
        .status(200)
        .json({ message: `Found user`, data: formatUserResponse(user) });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await _findAllUsers();

    return res
      .status(200)
      .json({ message: `Found users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting all users!" });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (username || email || password) {
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      if (username || email) {
        let existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "username already exists" });
        }
        existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "email already exists" });
        }
      }

      let hashedPassword;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }
      const updatedUser = await _updateUserById(
        userId,
        username,
        email,
        hashedPassword,
      );
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res
        .status(400)
        .json({
          message:
            "No field to update: username and email and password are all missing!",
        });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {
      // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(
        userId,
        isAdmin === true,
      );
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    await _deleteUserById(userId);
    return res
      .status(200)
      .json({ message: `Deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when deleting user!" });
  }
}

export async function updateUserPassword(req, res) {
  console.log("updateUserPassword called");
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password and new password are required" 
      });
    }

    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: "New password must be at least 8 characters long" 
      });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password
    const updatedUser = await _updateUserPasswordById(userId, hashedPassword);

    return res.status(200).json({
      message: "Password updated successfully",
      data: formatUserResponse(updatedUser),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating password!" });
  }
}

export async function updateUsername(req, res) {
  console.log("updateUsername called");
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    // Check if username already exists
    const existingUser = await _findUserByUsername(username);
    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Update username
    const updatedUser = await _updateUsernameById(userId, username);

    return res.status(200).json({
      message: "Username updated successfully",
      data: formatUserResponse(updatedUser),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating username!" });
  }
}

export function formatUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    verified: user.verified,
    createdAt: user.createdAt,
  };
}
