/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-21
 * Purpose: To create a Mongoose model for password reset tokens similar to the user verification model.
 * Author Review: I validated the schema structure follows the same security patterns as verification tokens with proper indexing and expiration.
 */

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PasswordResetModelSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
    unique: false, // multiple reset tokens can be generated for the same user
    index: true, // index the userId field for faster lookups
  },
  token: { // should be a hashed token for security
    type: String,
    required: true,
    unique: true,
    index: true, // index the token field for faster lookups
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
    expires: 3600, // Token will automatically be removed after 1 hour (3600 seconds)
  }
});

export default mongoose.model("PasswordResetModel", PasswordResetModelSchema);