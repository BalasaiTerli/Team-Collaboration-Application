const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dbConnection = require("./config/db")
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");


dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 5000;


dbConnection(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
