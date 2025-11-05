const express = require("express");
const upload = require("../middleware/upload");
const User = require("../models/userModel");

const router = express.Router();

// Single file upload (avatar)
router.post("/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.body.userId; // frontend/postman me bhejna
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = req.file.path; // save file path in DB
    await user.save();

    res.json({
      message: "Avatar uploaded & saved in DB",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Multiple file upload (gallery) - storing paths in DB array
router.post("/gallery", upload.array("images", 5), async (req, res) => {
  try {
    const userId = req.body.userId; // frontend/postman me bhejna
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // store uploaded files paths in an array
    if (!user.gallery) user.gallery = [];
    req.files.forEach((file) => user.gallery.push(file.path));

    await user.save();

    res.json({
      message: "Gallery uploaded & saved in DB",
      files: req.files,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
