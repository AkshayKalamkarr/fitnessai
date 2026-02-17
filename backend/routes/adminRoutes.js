const express = require("express");
const router = express.Router();
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Get All Users (Admin Only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Delete User (Admin Only)
router.delete("/user/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
