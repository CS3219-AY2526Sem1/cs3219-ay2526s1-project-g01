import { 
  findUserByUsernameAndEmail as _findUserByUsernameAndEmail, 
  findUserVerifyRecordByTokenAndId as _findUserVerifyRecordByTokenAndId, 
  updateUserVerificationStatusById as _updateUserVerificationStatusById,
  deleteUserVerifyRecordByUserId as _deleteUserVerifyRecordByUserId,
  createUserVerifyRecord as _createUserVerifyRecord,
  findUserVerifyRecordById as _findUserVerifyRecordById,
} from "../model/repository.js";
import crypto from "crypto";
import { makeVerificationLink, sendVerificationEmail } from "../utils/emailSender.js";

export async function verifyUser(req, res) {
  try {
    // extract username, email and token from query params
    const { username, email, token } = req.query;
    // decode URI components in case of special characters
    const decodedUsername = decodeURIComponent(username);
    const decodedEmail = decodeURIComponent(email);
    const decodedToken = decodeURIComponent(token);

    // check if any fields is missing
    if (!decodedUsername || !decodedEmail || !decodedToken) {
      return res.status(400).json({ message: "Missing username and/or email and/or token" });
    }

    // find user by username and email
    const user = await _findUserByUsernameAndEmail(decodedUsername, decodedEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if user is already verified
    if (user.verified) {
      return res.status(200).json({ message: "User already verified" });
    }

    // hash the provided token
    const hashedToken = crypto.createHash("sha256").update(decodedToken).digest("hex");

    // check if hashed token matches the one in the database
    const userVerifyRecord = await _findUserVerifyRecordByTokenAndId(hashedToken, user._id);
    if (!userVerifyRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // mark user as verified
    await _updateUserVerificationStatusById(user._id, true);

    // delete the used token
    await _deleteUserVerifyRecordByUserId(user._id);
    return res.status(200).json({ message: "User verified successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when verifying user!" });
  }
}

export async function resendVerification(req, res) {  
  try {
    // extract username and email from query params
    const { username, email } = req.query;
    // decode URI components in case of special characters
    const decodedUsername = decodeURIComponent(username);
    const decodedEmail = decodeURIComponent(email);
    // check if any fields is missing
    if (!decodedUsername || !decodedEmail) {
      return res.status(400).json({ message: "Missing username and/or email" });
    }
    // find user by username and email
    const user = await _findUserByUsernameAndEmail(decodedUsername, decodedEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if user is already verified and if it is send a clear error message
    if (user.verified) {
      // send error message
      return res.status(400).json({ message: "User already verified" });
    }
    // check if any verification is resend too soon (within 30 seconds)
    const existingRecord = await _findUserVerifyRecordById(user._id);
    if (existingRecord.length > 0) {
      const timeSinceLastSent = Date.now() - new Date(existingRecord[0].createdAt).getTime();
      if (timeSinceLastSent < 30 * 1000) { // 30 seconds
        return res.status(429).json({ message: "Verification email resent too soon. Please wait before trying again." });
      }
    }

    // else, proceed to resend verification email
    // create a new token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // delete any existing tokens for this user
    await _deleteUserVerifyRecordByUserId(user._id);

    // create and save new token
    await _createUserVerifyRecord(user._id, hashedToken);

    // create verification link
    const verifyUrl = makeVerificationLink(user.email, user.username, rawToken);

    // send verification email
    await sendVerificationEmail(user.email, verifyUrl);
    return res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when resending verification email!" });
  }
}
