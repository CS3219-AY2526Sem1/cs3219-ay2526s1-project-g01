/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To create a Mongoose model for email change codes similar to the password reset model.
 * Author Review: I validated the schema structure follows the same patterns as password reset tokens with proper indexing and expiration.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChangeEmailCodeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
    unique: false, // multiple codes can be generated for the same user
    index: true, // index the userId field for faster lookups
  },
  code: { // 6-digit code for email change verification
    type: String,
    required: true,
    unique: true,
    index: true, // index the code field for faster lookups
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
    expires: 3600, // Code will automatically be removed after 1 hour (3600 seconds)
  }
});

export default mongoose.model("ChangeEmailCode", ChangeEmailCodeSchema);
