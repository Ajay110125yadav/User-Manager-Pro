const express = require("express");
const router = express.Router();
const Comment = require("../controllers/commentController");
const  protect   = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createComment, getAllComments, updateComment, deleteComment } = require("../controllers/commentController");

// CREATE comment
router.post("/", protect, Comment.createComment);

// GET all comments (optional)
router.get("/", protect, Comment.getAllComments);

// UPDATE comment (admin)
router.put("/:id", protect, authorize("admin"), updateComment);

// DELETE comment (admin)
router.delete("/:id", protect, authorize("admin"), deleteComment);

module.exports = router;
