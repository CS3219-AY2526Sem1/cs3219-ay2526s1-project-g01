/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-24
 * Purpose: To create verification routes for handling email verification and resend functionality.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To add optional purpose parameter to verification routes for supporting both signup and email change verification.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To add email change request routes for requesting verification code and changing email.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-23
 * Purpose: To add verify-email-change-code route for validating 6-digit codes only.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import express from "express";
import { verifyUser, resendVerification, requestEmailChangeCode, verifyEmailChangeCode, changeEmail } from "../controller/verification-controller.js";

const router = express.Router();

// GET /verification/verify?username=...&email=...&token=...&purpose=...
// purpose is optional and defaults to 'signup'
router.get("/verify", verifyUser);

// POST /verification/resend?username=...&email=...&purpose=...
// purpose is optional and defaults to 'signup'
// Only 'signup' purpose is allowed for resending verification
// this is because email change verification should be requested after logging in
router.post("/resend", resendVerification);

// POST /verification/request-email-change-code
// Request a 6-digit verification code to change email (step 1 of email change)
// Body: { userId }
// Sends code to user's current email
router.post("/request-email-change-code", requestEmailChangeCode);

// POST /verification/verify-email-change-code
// Verify the 6-digit code without sending verification link (step 1.5 of email change)
// Body: { userId, code }
// Validates the code and returns success if valid
router.post("/verify-email-change-code", verifyEmailChangeCode);

// POST /verification/change-email
// Request email change after validating 6-digit code (step 2 of email change)
// Body: { userId, username, oldEmail, newEmail, code }
// Validates the 6-digit code, then sends verification link to new email
router.post("/change-email", changeEmail);

export default router;