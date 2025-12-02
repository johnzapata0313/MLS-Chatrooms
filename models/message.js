const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chatroom",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: {
    type: String
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    url: String,
    publicId: String,
    filename: String
  },
  messageType: {
    type: String,
    enum: ["text", "system"],
    default: "text"
  },
  thumbsUp: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    photo: {
      url: String,
      publicId: String,
      filename: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", MessageSchema);