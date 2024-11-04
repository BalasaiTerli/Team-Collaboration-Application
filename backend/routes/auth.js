const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const cookieParser = require("cookie-parser")
const app = express()

const JWT_SECRET_KEY = "tAsK";
app.use(cookieParser())

// Registration route
// Registration route
const register = async (req, res) => {
  const { email, password, profileUrl } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists with this email.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    profileUrl,
  });

  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user: " + error.message);
  }
};


// Login route
const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format.");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    // Create a token
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).send({message:"Login successful",token}); // A simple success message
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
};



module.exports = { register, login };
