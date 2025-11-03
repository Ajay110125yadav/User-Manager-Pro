require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Register new user

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check all fields
    if(!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // check if user already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User register successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error){
    next(error);
  }
};

// Login user

console.log("JWT Secret loaded in controller:", process.env.JWT_SECRET);

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    console.log("Found user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("DEBUG: user._id =", user?._id);
    console.log("DEBUG: JWT_SECRET =", process.env.JWT_SECRET)
    const token = jwt.sign({ id: user._id }, "mySuperSecretKey123", {
      expiresIn: "1h",
    });


    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };