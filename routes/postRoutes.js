const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createPost, getAllPosts, updatePost, deletePost } = require("../controllers/postController");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", getAllPosts);
router.post("/", protect, createPost);
router.put("/:id", protect, authorize("admin"), updatePost);
router.delete("/:id", protect, authorize("admin"), deletePost);

module.exports = router;
