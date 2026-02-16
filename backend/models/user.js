const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    maritalStatus: String,
    goal: String,
    experience: String,
    medicalCondition: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    weeklyPlan: [
      {
        day: String,
        workout: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
