/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To add purpose field to user verification model to distinguish between new account verification and email change verification.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserVerifyModelSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
    unique: false, // multiple verification tokens can be generated for the same user
    index: true, // index the userId field for faster lookups
  },
  token: { // should be a hashed token for security
    type: String,
    required: true,
    unique: true,
    index: true, // index the token field for faster lookups
  },
  purpose: { // purpose of verification: "signup" or "email-change"
    type: String,
    required: true,
    enum: ['signup', 'email-change'],
    default: 'signup',
  },
  newEmail: { // new email address for email-change purpose
    type: String,
    required: false, // only required when purpose is 'email-change'
  },
  newEmailCanonical: { // canonical (lowercase) version of new email for consistency
    type: String,
    required: false, // only required when purpose is 'email-change'
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
    expires: 3600, // Token will automatically be removed after 1 hour (3600 seconds)
  }
});

export default mongoose.model("UserVerifyModel", UserVerifyModelSchema);
