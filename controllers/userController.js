const User = require("../models/userModel");

// ✅ GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };
    if (req.file) updateData.profilePic = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADMIN FEATURES
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ success: true, totalUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, getAnalytics };
