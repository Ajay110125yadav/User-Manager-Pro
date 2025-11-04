const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user,
  });
});

router.get("/dashboard", protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.id}, this is your dashboard`,
  });
});

module.exports = router;
