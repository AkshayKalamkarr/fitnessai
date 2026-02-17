const bcrypt = require("bcryptjs");
const router = require("express").Router();
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
    const {
      fullName,
      username,
      email,
      password,
      age,
      gender,
      height,
      weight,
      maritalStatus,
      goal,
      experience,
      medicalCondition,

    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({
      fullName,
      username,
      email,
      password,
      age,
      gender,
      height,
      weight,
      maritalStatus,
      goal,
      experience,
      medicalCondition,
      weeklyPlan: defaultPlan,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error); // 👈 ADD THIS
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
