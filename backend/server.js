const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your-secret-key";

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://login:username@adie.fy9ntbq.mongodb.net/testing?retryWrites=true&w=majority&appName=adie",
    {}
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password: password });
    await user.save();
    res.status(201).json({ message: "Login Failed" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(username)
  console.log(password)

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
