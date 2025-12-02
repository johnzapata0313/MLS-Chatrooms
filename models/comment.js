const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
message: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message",
  required: true,
},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);