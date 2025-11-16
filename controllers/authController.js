const User = require("../models/userModel");
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
