const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: {    // Relation yahan ban raha hai.
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // "User" model se link.
  }
});

module.exports = mongoose.model("Post", postSchema);