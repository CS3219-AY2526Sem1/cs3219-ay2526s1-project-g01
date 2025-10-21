import UserModel from "./user-model.js";
import UserVerifyModel from "./user-verify-model.js";
import PasswordResetModel from "./password-reset-model.js";
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

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}
//#endregion

//#region User Verify Model related fns

export async function createUserVerifyRecord(userId, token) {
  return new UserVerifyModel({ userId, token }).save();
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
