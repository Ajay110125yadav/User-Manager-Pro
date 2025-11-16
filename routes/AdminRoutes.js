const express = require("express");
const router = express.Router();
const { getAllUsers, getAnalytics } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/analytics", protect, authorize("admin"), getAnalytics);

module.exports = router;
