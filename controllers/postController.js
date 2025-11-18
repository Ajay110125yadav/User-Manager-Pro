const Post = require("../models/Post");
const redis = require("../utils/redis"); // Redis client

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

        // Clear cache after create
        await redis.del("all_posts");

        res.status(201).json({ success: true, post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ---------------------------
// GET ALL POSTS (WITH CACHING)
// ---------------------------
exports.getAllPosts = async (req, res) => {
    try {
        // Check cache first
        const cachedPosts = await redis.get("all_posts");
        if (cachedPosts) {
            return res.status(200).json({
                success: true,
                fromCache: true,
                count: JSON.parse(cachedPosts).length,
                posts: JSON.parse(cachedPosts)
            });
        }

        // If no cache, fetch from DB
        const posts = await Post.find()
            .populate("author", "name email")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name email" }
            })
            .sort({ createdAt: -1 });

        // Store in Redis cache for 10 minutes
        await redis.set("all_posts", JSON.stringify(posts), "EX", 600);

        res.status(200).json({ success: true, fromCache: false, count: posts.length, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
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

    // Clear cache after update
    await redis.del("all_posts");

    res.status(200).json({ success: true, post });
  } catch (error) {
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

    // Clear cache after delete
    await redis.del("all_posts");

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
