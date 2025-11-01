const User = require('../models/userModel');

// GET all users.

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true,data: users });
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