const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create post (linked with a user).

router.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = await Post.create({ title, content, user: userId });
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// GET all posts + populate user Info

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user"); // user details attach
    res.json({ success: true, posts });
  } catch (error) {
    res. status(400).json({ success: false, message: "Server Error",  error:message });
  }
});

module.exports = router;