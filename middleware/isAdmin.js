module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized"});
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};