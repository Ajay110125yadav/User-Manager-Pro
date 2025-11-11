require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    const admin = new User({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    await admin.save();
    console.log(" Default admin created: admin@example.com / admin123");
  } else {
    console.log("Admin already exists");
  }
  mongoose.connection.close();
});