const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

dotenv.config();

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

// ------------------------
// CREATE APP FIRST (IMPORTANT)
// ------------------------
const app = express();

// ------------------------
// SECURITY MIDDLEWARES
// ------------------------
app.use(helmet());          // Security headers
app.use(mongoSanitize());   // Prevent NoSQL injection
app.use(xss());             // Prevent XSS attacks
app.use(cors());            // CORS enabled
app.use(logger);            // Custom logger

// ------------------------
// RATE LIMITER
// ------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again in 15 minutes",
});
app.use(limiter);

// ------------------------
// BODY PARSER
// ------------------------
app.use(express.json());

// ------------------------
// ROUTES
// ------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// ------------------------
// 404 ROUTE
// ------------------------
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ------------------------
// ERROR HANDLER
// ------------------------
app.use(errorHandler);

// ------------------------
// MONGOOSE CONNECT
// ------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
