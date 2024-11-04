const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { OAuth2Client } = require("google-auth-library");

dotenv.config(); 

const user = require("./models/user");
const Friend = require("./models/Friend");
const { register, login } = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 8000; // Use PORT from .env
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // Use JWT secret from .env
const dbURI = process.env.DB_URI; // Use DB URI from .env

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const Limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    status: 429,
    error: "Too many requests. Please wait a minute before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Use Google Client ID from .env
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // Use Google Client Secret from .env
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) return res.sendStatus(403);
    req.userId = decodedToken.id;
    next();
  });
};

app.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let existingUser = await user.findOne({ googleId: payload.sub });
    if (!existingUser) {
      const newUser = new user({
        googleId: payload.sub,
        email: payload.email,
        profileUrl: payload.picture,
      });
      existingUser = await newUser.save();
    }

    const jwtToken = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", jwtToken, { httpOnly: true, secure: false });
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ message: "Invalid token", error });
  }
});

app.post("/register", Limiter, register);
app.post("/login", Limiter, login);

app.get("/data", authenticateToken, async (req, res) => {
  try {
    const userData = await user.findById(req.userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: userData.email,
      profileUrl: userData.profileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

app.put("/updateProfileUrl", authenticateToken, async (req, res) => {
  const { profileUrl } = req.body;
  const userId = req.userId;

  try {
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { profileUrl },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    res.status(200).json({
      message: "Profile URL updated successfully",
      profileUrl: updatedUser.profileUrl,
    });
  } catch (error) {
    res.status(500).send("Failed to update profile URL");
  }
});

app.post("/add-friend", authenticateToken, async (req, res) => {
  try {
    const { firstname, lastname, phonenumber, address } = req.body;
    const newFriend = new Friend({
      userId: req.userId,
      firstname,
      lastname,
      phonenumber,
      address,
    });
    await newFriend.save();
    res
      .status(201)
      .json({ message: "Friend added successfully!", friend: newFriend });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding friend", error: error.message });
  }
});

app.get("/friends", authenticateToken, async (req, res) => {
  try {
    const friends = await Friend.find({ userId: req.userId });
    res.status(200).json(friends);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching friends", error: error.message });
  }
});

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
