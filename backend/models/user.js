const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordCode: { type: String, required: false, default: null },
  resetPasswordCodeTimeStamp: { type: String, required: false, default: null },
  profilePic: { type: String, required: false },
  isVerified: { type: Boolean, required: false, default: false },
  isAdmin: { type: Boolean, required: false, default: false },
  dateJoined: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
