const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require("sanitize-html");

dotenv.config();

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// Body parser
app.use(express.json());

// Morgan Access log setup
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Log every request to access.log
app.use(morgan("combined", { stream: accessLogStream }));

// Security
app.use(helmet());
app.use(cors());

// XSS Clean (safe alternative)
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    }
  }
  next();
});

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Error handler
app.use(errorHandler);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
