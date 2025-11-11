const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age:{type: Number, required: false },
  password: {type: String, required: true},
  profilePic: {type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"},
  refreshToken: {type: String, default: null},
  role: { type: String, enum: ["user", "admin"], default: "user"},
}, { timestamps: true }
);

// pre-save hook: hash password automatically

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password.password, 10);
  next();
});

// method for comparing passwords

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);