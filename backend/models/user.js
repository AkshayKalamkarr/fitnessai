const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
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
  { timestamps: true }
);

// 🔐 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
