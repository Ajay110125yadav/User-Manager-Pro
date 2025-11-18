const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../utils/logger");

module.exports = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            logger.warn(`Unauthorized Access Attempt (No Token) - ${req.method} ${req.originalUrl}`);
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            logger.warn(`Unauthorized Access (User Not Found) - Token: ${token.substring(0, 10)}...`);
            return res.status(403).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (err) {
        logger.error(`AuthMiddleware Error: ${err.message}`);
        res.status(403).json({ message: "Invalid token" });
    }
};
