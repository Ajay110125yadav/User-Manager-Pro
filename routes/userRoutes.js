const express = require("express");
const router = express.Router();

const { getUserProfile, updateUserProfile, getAllUsers, getAnalytics } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware"); // <-- default export, no {}
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

// USER
router.get("/profile", protect, getUserProfile);
router.put("/profile/update", protect, upload.single("profilePic"), updateUserProfile);

// ADMIN
router.get("/admin/users", protect, authorize("admin"), getAllUsers);
router.get("/admin/analytics", protect, authorize("admin"), getAnalytics);

module.exports = router;
