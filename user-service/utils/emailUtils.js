/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: ChatGPT 5 thinking), date: 2025-09-24
 * Purpose: To create email utility functions for sending verification emails using Nodemailer with SMTP configuration and verification link generation.
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

/**
 * Build a user-facing verification link pointing at your frontend page.
 * Example frontend handler: /auth/verify?email=...&token=...
 */
export function makeVerificationLink(email, username, rawToken) {
  // TODO: Update base URL logic if deploying to a real production domain
  let base;
  if (process.env.NODE_ENV === "production") {
    base = "https://cs3219-ay2526s1-project-g01-user-service-151036034449.asia-southeast1.run.app";
  } else {
    base = "http://localhost:3000";
  }
  
  const params = new URLSearchParams({
    email: email,
    username: username,
    token: rawToken,
  });
  
  const fullUrl = `${base}/verify?${params.toString()}`;
  
  return fullUrl;
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


// ------------------------------------------------------------
// EXAMPLE USAGE (server-side)
// ------------------------------------------------------------
// import { sendVerificationEmail, makeVerificationLink } from "@/lib/mailer";
// const link = makeVerificationLink(user.email, rawToken);
// await sendVerificationEmail(user.email, link);

// ------------------------------------------------------------
// TROUBLESHOOTING
// - 5.7.0 "Username and Password not accepted": you used your normal Gmail password.
//   Create a Gmail App Password (Google Account → Security → 2-Step → App passwords).
// - ETIMEDOUT / ECONNREFUSED: firewall or wrong host/port.
// - HTML goes to spam: set SPF/DKIM/DMARC on your sending domain, keep templates simple.
// ------------------------------------------------------------
