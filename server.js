const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require("./routes/uploadRoutes");
const postRoutes = require("./routes/postRoutes");
const enrollRoutes = require("./routes/enrollmentRoutes");
const AdminRoutes = require("./routes/AdminRoutes");


const app = express();

app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(logger);

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/Admin", AdminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/enroll", enrollRoutes);

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== MONGODB =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
