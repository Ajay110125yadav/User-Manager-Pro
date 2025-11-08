const mongoose = require('mongoose');
const { refreshToken } = require('../controllers/authController');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age:{type: Number, required: false },
  password: {type: String, required: true},
  profilePic: {type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"},
  refreshToken: {type: String, default: null},
  role: { type: String, enum: ["user", "admin"], default: "user"},
}, { timeStamps: true });

module.exports = mongoose.model('User', userSchema);