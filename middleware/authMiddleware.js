const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ✅ Verify Access Token Middleware
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token after split:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // user attach ho gaya
    next();
  } catch (err) {
    console.log("Error in protect middleware:", err.message);
    res.status(401).json({ message: "Not authorized", error: err.message });
  }
};

module.exports = protect;
