import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // email canonical is used to store a lowercase version of the email for case-insensitive searches
  // this is to prevent duplicate emails with different cases (e.g., foochao01@gmail.com and FOOCHAO01@gmail.com which essentially is the same thing)
  // source: https://www.pipedrive.com/en/blog/does-capitalization-matter-in-email 
  // summary: modern email systems treat the local part (before the @) as case-sensitive, but in practice, most email providers do not.
  emailCanonical: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    default: function() {
      return this.email.toLowerCase();
    }
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("UserModel", UserModelSchema);
