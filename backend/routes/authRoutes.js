const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Default Weekly Plan
const defaultPlan = [
  { day: "Monday", workout: "Chest" },
  { day: "Tuesday", workout: "Back" },
  { day: "Wednesday", workout: "Legs" },
  { day: "Thursday", workout: "Shoulder" },
  { day: "Friday", workout: "Arms" },
  { day: "Saturday", workout: "Full Body" },
  { day: "Sunday", workout: "Rest Day" },
];

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({
    token,
    role: user.role,
    user,
  });
});

module.exports = router;
