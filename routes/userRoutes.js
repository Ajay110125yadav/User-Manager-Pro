const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const User = require("../models/userModel")

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

// New Route: Get all Users with Pagination, sorting, Filtering.

router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";

    // 🔍 Search (by name or email)
    const searchQuery = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    // 🧩 Filter (e.g., role=admin)
    const filterQuery = {};
    if (req.query.role) filterQuery.role = req.query.role;

    // 🎯 Merge search + filter
    const query = { ...searchQuery, ...filterQuery };

    const users = await User.find(query).sort(sort).skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});


module.exports = router;
