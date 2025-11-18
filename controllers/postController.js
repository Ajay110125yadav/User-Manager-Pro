const Post = require("../models/Post");
const redis = require("../utils/redis");
const logger = require("../utils/logger");

// ---------------------------
// CREATE POST
// ---------------------------
exports.createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) return res.status(400).json({ message: "Title and body required" });

        const post = await Post.create({
            title,
            body,
            author: req.user._id
        });

        // Clear cache
        await redis.del("all_posts");

        // SUCCESS LOG
        logger.info(`Post Created by User: ${req.user._id}`);

        res.status(201).json({ success: true, post });
    } catch (err) {
        logger.error(`CreatePost Error: ${err.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ---------------------------
// GET ALL POSTS (WITH CACHING)
// ---------------------------
exports.getAllPosts = async (req, res) => {
    try {
        const cachedPosts = await redis.get("all_posts");
        if (cachedPosts) {
            logger.info("Returned posts from cache");
            return res.status(200).json({
                success: true,
                fromCache: true,
                count: JSON.parse(cachedPosts).length,
                posts: JSON.parse(cachedPosts)
            });
        }

        const posts = await Post.find()
            .populate("author", "name email")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name email" }
            })
            .sort({ createdAt: -1 });

        await redis.set("all_posts", JSON.stringify(posts), "EX", 600);

        logger.info("Returned posts from database");

        res.status(200).json({ success: true, fromCache: false, count: posts.length, posts });
    } catch (err) {
        logger.error(`GetAllPosts Error: ${err.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------------------
// UPDATE POST
// ---------------------------
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json({ success: false, message: "Post not found" });

    post.title = req.body.title || post.title;
    post.body = req.body.body || post.body;

    await post.save();

    await redis.del("all_posts");

    logger.info(`Post Updated: ${req.params.id}`);

    res.status(200).json({ success: true, post });
  } catch (error) {
    logger.error(`UpdatePost Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------
// DELETE POST
// ---------------------------
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    await redis.del("all_posts");

    logger.info(`Post Deleted: ${req.params.id}`);

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    logger.error(`DeletePost Error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
