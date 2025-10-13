/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-24
 * Purpose: To create verification routes for handling email verification and resend functionality.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import express from "express";
import { verifyUser, resendVerification } from "../controller/verification-controller.js";

const router = express.Router();

// GET /verification/verify?username=...&email=...&token=...
router.get("/verify", verifyUser);

// POST /verification/resend?username=...&email=...
router.post("/resend", resendVerification);

export default router;