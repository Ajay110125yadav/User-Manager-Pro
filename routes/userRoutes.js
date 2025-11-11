const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/userModel");
const { registerUser, loginUser, refreshToken, logoutUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getAllUsersDetailed,
  getUserProfile, 
  getAnalytics 
} = require("../controllers/userController");


// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

// Basic User CRUD Routes.

router.post("/", protect, createUser);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

router.get("/admin/users", protect, authorize("admin"), getAllUsersDetailed);
router.get("/admin/analytics", protect, authorize("admin"), getAnalytics);
// profile route.
router.get("/profile/:id", protect, getUserProfile);


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
  
  router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin! You have full access.",
    user: req.user,
  });
  });

// ✅ Token verification route
router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({ success: false, message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      valid: true,
      message: "Token is valid",
      decoded,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      valid: false,
      message: "Token expired or invalid",
      error: err.message,
    });
  }
});




module.exports = router;
