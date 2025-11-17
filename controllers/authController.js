const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ==============================
//  GENERATE TOKENS
// ==============================
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// ==============================
//  REGISTER
// ==============================
exports.registerUser = async (req, res) => {
  try {
    console.log("REGISTER HIT IN CONTROLLER");

    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered",
      ...tokens,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==============================
//  LOGIN
// ==============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      ...tokens,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==============================
//  REFRESH TOKEN
// ==============================
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ message: "Refresh token required" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({ success: true, ...tokens });
  } catch (err) {
    res.status(401).json({ message: "Token expired", error: err.message });
  }
};

// ==============================
//  LOGOUT
// ==============================
exports.logoutUser = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ refreshToken: token });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    user.refreshToken = null;
    await user.save();

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==============================
//  CHECK TOKEN
// ==============================
exports.checkToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(400).json({ valid: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

// FORGOT PASSWORD (send reset token)

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create raw token and hased token to store in DB
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;


    const message = `You requested a password reset.\n\nClick the link or paste in browser within 15 minutes:\n\n${resetUrl}`;

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail({
          to: user.email,
          subject: "Password reset token",
          text: message,
        });
      } else {
        // fallback for local/dev: log the reset url.
        console.log("Result URL (dev):", resetUrl);
      }


      return res.status(200).json({
        success: true,
        message: "Reset token sent to email (or logged to console in dev).",
      });
    } catch (err) {
      // rollback token fields on email failure
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "Email could not be sent", error: err.message });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reset password (using token param).

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "New password is required" });

    const hased = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hased,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // set new password.

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // optionally generate new access/refresh tokens and attach.

    const tokens = generateTokens(user);
    user.refreshToken = token.refreshToken;


    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      ...tokens, // optionally return tokens so user is logged in after reset
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};