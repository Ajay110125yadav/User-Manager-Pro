const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    refreshToken: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // ADD these two fileds for password Reset.
    resetPasswordToken: {type: String },
    resetPasswordExpire: {type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
