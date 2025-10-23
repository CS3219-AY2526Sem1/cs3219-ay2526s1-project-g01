/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To add repository functions for updating user password and username separately.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To implement change email code model related functions including find by user ID.
 * Author Review: I validated correctness, security, and performance of the code.
 *
 * Additional AI Assistance Disclosure:
 * Tool: GitHub Copilot (Grok Code Fast 1), date: 2025-10-23
 * Purpose: To add purpose field to user verify record creation for distinguishing signup vs email change verification.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import UserModel from "./user-model.js";
import UserVerifyModel from "./user-verify-model.js";
import PasswordResetModel from "./password-reset-model.js";
import ChangeEmailCode from "./change-email-code.js";
import "dotenv/config";
import { connect } from "mongoose";

//#region util fns
export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}
//#endregion

//#region User Model related fns
export async function createUser(username, email, password) {
  return new UserModel({ username, email, password }).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ emailCanonical: email.toLowerCase() });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [
      { username },
      { emailCanonical: email.toLowerCase() },
    ],
  });
}

// for stricter matching when needed such as when verifying email ownership
export async function findUserByUsernameAndEmail(username, email) {
  return UserModel.findOne({
    $and: [
      { username },
      { emailCanonical: email.toLowerCase() },
    ],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function updateUserById(userId, username, email, password) {
  const updateFields = {
    username,
    password,
  };
  
  if (email) {
    updateFields.email = email;
    updateFields.emailCanonical = email.toLowerCase();
  }
  
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: updateFields,
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true },  // return the updated user
  );
}

export function updateUserVerificationStatusById(userId, verified) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        verified,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserPasswordById(userId, password) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        password,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUsernameById(userId, username) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserEmailById(userId, email) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        email,
        emailCanonical: email.toLowerCase(),
      },
    },
    { new: true },  // return the updated user
  );
}

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}
//#endregion

//#region User Verify Model related fns

export async function createUserVerifyRecord(userId, token, purpose = 'signup', newEmail = null) {
  const record = { userId, token, purpose };
  if (newEmail) {
    record.newEmail = newEmail;
    record.newEmailCanonical = newEmail.toLowerCase();
  }
  return new UserVerifyModel(record).save();
}

export async function findUserVerifyRecordByTokenAndId(token, userId) {
  return UserVerifyModel.findOne({ 
    $and: [
      { token },
      { userId },
    ],
  });
}

export async function findUserVerifyRecordById (userId) {
  return UserVerifyModel.find({ userId });
}

export async function findUserVerifyRecordByNewEmail(newEmail) {
  return UserVerifyModel.findOne({ newEmailCanonical: newEmail.toLowerCase() });
}

export async function deleteUserVerifyRecordByUserId(userId) {
  return UserVerifyModel.deleteMany({ userId });
}

//#endregion

//#region password reset model related fns
export async function createPasswordResetRecord(userId, token) {
  return new PasswordResetModel({ userId, token }).save();
}

export async function findPasswordResetRecordByTokenAndId(token, userId) {
  return PasswordResetModel.findOne({ 
    $and: [
      { token },
      { userId },
    ],
  });
}

export async function findPasswordResetRecordById (userId) {
  return PasswordResetModel.find({ userId });
}

export async function deletePasswordResetRecordByUserId(userId) {
  return PasswordResetModel.deleteMany({ userId });
}
//#endregion

//#region change email code model related fns
export async function createChangeEmailCodeRecord(userId, code) {
  return new ChangeEmailCode({ userId, code }).save();
}

export async function findChangeEmailCodeByUserId(userId) {
  return ChangeEmailCode.findOne({ userId });
}

export async function findChangeEmailCodeByCodeAndUserId(code, userId) {
  return ChangeEmailCode.findOne({ 
    $and: [
      { code },
      { userId },
    ],
  });
}

export async function deleteChangeEmailCodeByUserId(userId) {
  return ChangeEmailCode.deleteMany({ userId });
}

//#endregion
