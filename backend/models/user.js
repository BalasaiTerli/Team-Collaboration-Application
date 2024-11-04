const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Password can be optional if they sign up with Google only
  profileUrl: { type: String },
  googleId: { type: String, unique: true }, // Add googleId to store the Google user's unique ID
});

module.exports = mongoose.model("User", userSchema);
