const User = require('../models/userModel');

// GET all users.

// Get All Users (Admin Only)
exports.getAllUsersDetailed = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // sab users bina password ke
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// POST - create user

exports.createUser = async (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age){
    return res.status(400).json({ success: false, message: "All field required" });
  }

  const newUser = await User.create({ name, email, age });
  res.status(201).json({ success: true, data: newUser });
};

// PUT - update user.

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, data: updated });
};

// DELETE - remove user

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, message: "User deleted successfully" });
};

// Get single user profile (User or Admin).

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (req.user.role !== "admin" && req.user.id == userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ success: true, user });
} catch (err) {
  res.status(500).json({ success: false, message: err.message });
}
};

exports.getAllUsersDetailed = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, total: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Analytics (Admin only).

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin"});
    const normalUsers = await User.countDocuments({ role: "user" });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email role");

    res.json({
      success: true,
      totalUsers,
      admins,
      normalUsers,
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }

  // Get Logged-in User Profile.
  exports.getMyProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
};
