import express from "express";

import {
  handleLogin,
  handleVerifyToken,
  handleRequestPasswordReset,
  handleValidatePasswordResetToken,
  handleConfirmPasswordReset,
} from "../controller/auth-controller.js";
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

/**
 * POST /auth/login
 * Body: { email: string, password: string }
 * Logs in a user with email and password credentials
 */
router.post("/login", handleLogin);

/**
 * GET /auth/verify-token
 * Headers: { Authorization: "Bearer <token>" }
 * Verifies if the provided JWT token is valid and returns user data
 */
router.get("/verify-token", verifyAccessToken, handleVerifyToken);

/**
 * POST /auth/password/request-reset
 * Body: { email: string }
 * Initiates password reset process by sending reset email to user
 */
router.post("/password/request-reset", handleRequestPasswordReset);

/**
 * GET /auth/password/validate-token
 * Query: { username: string, email: string, token: string }
 * Validates password reset token without changing password
 */
router.get("/password/validate-token", handleValidatePasswordResetToken);

/**
 * POST /auth/password/confirm-reset
 * Query: { username: string, email: string, token: string }
 * Body: { newPassword: string }
 * Confirms password reset using token and sets new password
 */
router.post("/password/confirm-reset", handleConfirmPasswordReset);

export default router;
