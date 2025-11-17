const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.createComment = async (req, res) => {
  try {
    const { postId, body } = req.body;
    if (!body || !postId)
      return res.status(400).json({ success: false, message: "Post ID and body are required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = await Comment.create({
      body,
      author: req.user.id,
      post: postId,
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllComments = async (req, res) => {
  const comments = await Comment.find().populate("author", "name email").sort({ createdAt: -1 });
  res.json({ success: true, count: comments.length, comments });
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    comment.body = req.body.body || comment.body;
    await comment.save();

    res.status(200).json({ success: true, comment});
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteComment = async (req,res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404),json({ success: false, message: "Comment not found" });

    res.status(200).json({ success: true, message: "comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
