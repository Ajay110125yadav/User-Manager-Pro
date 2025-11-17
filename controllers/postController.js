const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) return res.status(400).json({ message: "Title and body required" });

        const post = await Post.create({
            title,
            body,
            author: req.user._id
        });

        res.status(201).json({ success: true, post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name email" }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: posts.length, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id);
    if (!post) return res.status(400).json({ success: false, message: "Post not found" });

    post.title = req.body.title || post.title;
    post.body = req.body.body || post.body;

    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });


    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
