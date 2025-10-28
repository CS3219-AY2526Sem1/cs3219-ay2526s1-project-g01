/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: ChatGPT 5 thinking), date: 2025-09-24
 * Purpose: To create email utility functions for sending verification emails using Nodemailer with SMTP configuration and verification link generation.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-21
 * Purpose: To add password reset email functionality with link generation and email sending functions.
 * Author Review: I validated the functions follow the same pattern as verification emails with proper security and error handling.
 *
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To implement change email code functions for sending 6-digit codes to users for email change verification and security warning notifications.
 * Author Review: I validated the email templates include proper security warnings and user identification.
 *
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To add purpose parameter to makeVerificationLink for supporting both signup and email change verification.
 * Author Review: I validated correctness, security, and performance of the code.
 */

// lib/mailer.js
// ESM version (Next.js / "type": "module")
// ------------------------------------------------------------
// WHAT THIS FILE DOES
// - Creates a Nodemailer SMTP transport using environment variables
// - Exposes a helper to send your *email verification* message
// - Safe defaults for Gmail: port 587 + STARTTLS (secure=false)
// ------------------------------------------------------------

import nodemailer from "nodemailer";

//#region Configuration
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
//#endregion

//#region General Helpers
/**
 * Small helper: parse boolean envs like "true"/"false"
 */
function boolEnv(v, fallback = false) {
  if (v == null) return fallback;
  return String(v).toLowerCase() === "true";
}

/**
 * Create a Nodemailer SMTP transport from env variables.
 * Required envs (example values shown for Gmail):
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587                # 465 for SSL, 587 for STARTTLS
 *   SMTP_SECURE=false            # true only if you use port 465
 *   SMTP_USER=yourgmail@gmail.com
 *   SMTP_PASS=<16-char App Password>  (NOT your normal Gmail password)
 *   MAIL_FROM="Your App" <yourgmail@gmail.com>
 *
 * For other providers (SendGrid SMTP, Mailgun SMTP, SES SMTP), swap host/user/pass.
 */
export function makeTransport() {
  // Throw early if critical envs are missing (helps during setup)
  for (const key of ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]) {
    if (!process.env[key]) throw new Error(`Missing env: ${key}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    // secure=true means TLS from the start (port 465). secure=false + port 587 uses STARTTLS.
    secure: boolEnv(process.env.SMTP_SECURE, false),
    auth: {
      user: process.env.SMTP_USER, // full email/SMTP user
      pass: process.env.SMTP_PASS, // Gmail App Password or provider SMTP password
    },
  });
}
//#endregion

//#region Email Verification Functions
/**
 * Build a user-facing verification link pointing at your frontend page.
 * Example frontend handler: /auth/verify?email=...&token=...
 */
export function makeVerificationLink(email, username, rawToken, purpose = 'signup') {
  let base = FRONTEND_BASE_URL;
  const params = new URLSearchParams({
    email: email,
    username: username,
    token: rawToken,
    purpose: purpose,
  });
  return `${base}/auth/verify?${params.toString()}`;
}

/**
 * Send the verification email
 * @param {string} to - recipient email address
 * @param {string} verifyUrl - absolute URL the user clicks to verify
 * @throws {Error} If required parameters are missing or if sending the email fails.
 *
 * NOTE: This function should be called **server-side only**.
 * Do not import in client components.
 *
 * If the email cannot be sent (e.g., SMTP connection fails, invalid credentials, etc.),
 * this function will throw an error.
 */
export async function sendVerificationEmail(to, verifyUrl) {
  // Basic sanity checks
  if (!to || !verifyUrl) throw new Error("sendVerificationEmail: missing to or verifyUrl");

  // Fallback "from" if not provided; best practice is to set MAIL_FROM in .env
  const from = process.env.MAIL_FROM || `"Your App" <no-reply@yourdomain.com>`;
  const subject = "Verify your email";

  // Plaintext version (for clients that block HTML)
  const text = `Verify your email:\n\n${verifyUrl}\n\nThis link expires in 60 minutes.`;

  // Lightweight, inbox-friendly HTML (avoid heavy CSS to reduce spam score)
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
      <h2 style="margin:0 0 12px">Confirm your email</h2>
      <p style="margin:0 0 16px">Click the button below to verify your email address.
        This link expires in 60 minutes.</p>
      <p style="margin:0 0 16px">
        <a href="${verifyUrl}"
           style="display:inline-block;padding:10px 16px;border-radius:8px;
                  text-decoration:none;border:1px solid #d0d7de">
          Verify email
        </a>
      </p>
      <p style="margin:0 0 8px">If the button doesn’t work, copy and paste this link:</p>
      <p style="word-break:break-all;margin:0"><a href="${verifyUrl}">${verifyUrl}</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p style="color:#6b7280;margin:0;font-size:12px">
        You’re receiving this because you signed up for an account.
        If you didn’t, you can ignore this email.
      </p>
    </div>
  `;

  // Actually send the email
  const transporter = makeTransport();
  // Optional: verify SMTP connection & creds at runtime (good during setup)
  // await transporter.verify();

  await transporter.sendMail({ from, to, subject, text, html });
}

//#endregion

//#region Password Reset Functions
/**
 * Build a user-facing password reset link pointing at your frontend page.
 * Example frontend handler: /auth/reset-password?email=...&token=...
 */
export function makeResetPasswordLink(email, username, rawToken) {
  let base = FRONTEND_BASE_URL;
  const params = new URLSearchParams({
    email: email,
    username: username,
    token: rawToken,
  });
  return `${base}/auth/reset-password?${params.toString()}`;
}

/**
 * Send the password reset email
 * @param {string} to - recipient email address
 * @param {string} resetUrl - absolute URL the user clicks to reset password
 * @throws {Error} If required parameters are missing or if sending the email fails.
 *
 * NOTE: This function should be called **server-side only**.
 * Do not import in client components.
 *
 * If the email cannot be sent (e.g., SMTP connection fails, invalid credentials, etc.),
 * this function will throw an error.
 */
export async function sendResetPasswordEmail(to, resetUrl) {
  // Basic sanity checks
  if (!to || !resetUrl) throw new Error("sendResetPasswordEmail: missing to or resetUrl");

  // Fallback "from" if not provided; best practice is to set MAIL_FROM in .env
  const from = process.env.MAIL_FROM || `"Your App" <no-reply@yourdomain.com>`;
  const subject = "Reset your password";

  // Plaintext version (for clients that block HTML)
  const text = `Reset your password:\n\n${resetUrl}\n\nThis link expires in 60 minutes.`;

  // Lightweight, inbox-friendly HTML (avoid heavy CSS to reduce spam score)
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
      <h2 style="margin:0 0 12px">Reset your password</h2>
      <p style="margin:0 0 16px">Click the button below to reset your password.
        This link expires in 60 minutes.</p>
      <p style="margin:0 0 16px">
        <a href="${resetUrl}"
           style="display:inline-block;padding:10px 16px;border-radius:8px;
                  text-decoration:none;border:1px solid #d0d7de">
          Reset password
        </a>
      </p>
      <p style="margin:0 0 8px">If the button doesn’t work, copy and paste this link:</p>
      <p style="word-break:break-all;margin:0"><a href="${resetUrl}">${resetUrl}</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p style="color:#6b7280;margin:0;font-size:12px">
        You’re receiving this because you requested a password reset.
        If you didn’t, you can ignore this email.
      </p>
    </div>
  `;

  // Actually send the email
  const transporter = makeTransport();
  // Optional: verify SMTP connection & creds at runtime (good during setup)
  // await transporter.verify();

  await transporter.sendMail({ from, to, subject, text, html });
}

//#endregion

//#region Change Email Code Functions
/**
 * Send the change email code email
 * @param {string} to - recipient email address
 * @param {string} userId - user ID for identification
 * @param {string} username - username for personalization
 * @param {string} code - 6-digit verification code
 * @throws {Error} If required parameters are missing or if sending the email fails.
 *
 * NOTE: This function should be called **server-side only**.
 * Do not import in client components.
 *
 * If the email cannot be sent (e.g., SMTP connection fails, invalid credentials, etc.),
 * this function will throw an error.
 */
export async function sendChangeEmailCode(to, userId, username, code) {
  // Basic sanity checks
  if (!to || !userId || !username || !code) throw new Error("sendChangeEmailCode: missing required parameters");

  // Fallback "from" if not provided; best practice is to set MAIL_FROM in .env
  const from = process.env.MAIL_FROM || `"Your App" <no-reply@yourdomain.com>`;
  const subject = "Email Change Verification Code";

  // Plaintext version (for clients that block HTML)
  const text = `Hello ${username} (${userId}),

Your email change verification code is: ${code}

This code is for changing your email address and expires in 60 minutes.

If you did not request this email change, please change your password immediately for security.

This code expires in 60 minutes.`;

  // Lightweight, inbox-friendly HTML (avoid heavy CSS to reduce spam score)
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5">
      <h2 style="margin:0 0 12px">Email Change Verification</h2>
      <p style="margin:0 0 16px">Hello ${username} (${userId}),</p>
      <p style="margin:0 0 16px">Your email change verification code is:</p>
      <div style="background:#f6f8fa;padding:16px;border-radius:8px;text-align:center;margin:0 0 16px">
        <span style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</span>
      </div>
      <p style="margin:0 0 16px">This code is for changing your email address and expires in 60 minutes.</p>
      <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:12px;border-radius:8px;margin:0 0 16px">
        <strong>Security Warning:</strong> If you did not request this email change, please change your password immediately for security.
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p style="color:#6b7280;margin:0;font-size:12px">
        You’re receiving this because an email change was requested for your account.
        If you didn’t request this, secure your account by changing your password.
      </p>
    </div>
  `;

  // Actually send the email
  const transporter = makeTransport();
  // Optional: verify SMTP connection & creds at runtime (good during setup)
  // await transporter.verify();

  await transporter.sendMail({ from, to, subject, text, html });
}

/**
 * Send email change warning notification
 * @param {string} to - recipient email address
 * @param {string} userId - user ID for identification
 * @param {string} username - username for personalization
 * @throws {Error} If required parameters are missing or if sending the email fails.
 *
 * NOTE: This function should be called **server-side only**.
 * Do not import in client components.
 *
 * If the email cannot be sent (e.g., SMTP connection fails, invalid credentials, etc.),
 * this function will throw an error.
 */
export async function sendEmailChangeWarning(to, userId, username) {
  // Basic sanity checks
  if (!to || !userId || !username) throw new Error("sendEmailChangeWarning: missing required parameters");

  // Fallback "from" if not provided; best practice is to set MAIL_FROM in .env
  const from = process.env.MAIL_FROM || `"Your App" <no-reply@yourdomain.com>`;
  const subject = "Security Notice: Email Change Request";

  // Plaintext version (for clients that block HTML)
  const text = `Security Notice: Email Change Request

Hello ${username} (${userId}),

A request to change your email address has been initiated on your PeerPrep account.

If you did not make this request, please take the following security actions:

1. Change your password immediately at: ${FRONTEND_BASE_URL}/account
2. If you are unable to log in to your account, contact PeerPrep technical support to report a potential security issue.

This is an automated security notification. If you initiated this email change request, no action is required.

PeerPrep Technical Support
cs3219g01@gmail.com`;

  // Lightweight, inbox-friendly HTML (avoid heavy CSS to reduce spam score)
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;line-height:1.5;max-width:600px;margin:0 auto">
      <div style="background:#f39c12;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="margin:0;font-size:24px">Security Notice</h1>
        <p style="margin:5px 0 0;font-size:16px">Email Change Request</p>
      </div>
      <div style="background:white;border:1px solid #dee2e6;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <p style="margin:0 0 16px;font-size:16px">Hello <strong>${username} (${userId})</strong>,</p>
        <p style="margin:0 0 20px;color:#495057">A request to change your email address has been initiated on your PeerPrep account.</p>

        <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:16px;border-radius:8px;margin:0 0 20px">
          <h3 style="margin:0 0 12px;color:#856404;font-size:16px">If you did not make this request:</h3>
          <ol style="margin:0;padding-left:20px;color:#856404">
            <li style="margin:0 0 8px">
              <strong>Change your password immediately</strong> at:
              <a href="${FRONTEND_BASE_URL}/account" style="color:#007bff;text-decoration:underline">${FRONTEND_BASE_URL}/account</a>
            </li>
            <li style="margin:0 0 8px">
              <strong>If you are unable to log in</strong> to your account, contact PeerPrep technical support to report a potential security issue.
            </li>
          </ol>
        </div>

        <p style="margin:0 0 16px;color:#6c757d;font-size:14px">
          This is an automated security notification. If you initiated this email change request, no action is required.
        </p>

        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <div style="text-align:center">
          <p style="margin:0 0 8px;color:#6b7280;font-size:14px"><strong>PeerPrep Technical Support</strong></p>
          <p style="margin:0;color:#6b7280;font-size:14px">cs3219g01@gmail.com</p>
        </div>
      </div>
    </div>
  `;

  // Actually send the email
  const transporter = makeTransport();
  // Optional: verify SMTP connection & creds at runtime (good during setup)
  // await transporter.verify();

  await transporter.sendMail({ from, to, subject, text, html });
}

//#endregion

