const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 🔹 Helper Function: Generate Access & Refresh Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// 🔹 Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// 🔹 Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// 🔹 Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(401).json({ message: "Refresh token is required" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid or expired refresh token" });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

// 🔹 Logout User
exports.logoutUser = async (req, res) => {
  try {
    const { token } = req.body; // 👈 Refresh token expected here

    if (!token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.refreshToken = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// check Token Validity (Optional Helper).

exports.checkToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) 
      return res.status(401).json({ valid: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      valid: true,
      userId: decoded.id,
      role: decoded.role,
    });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Token invalid or expired" });
  }
};
