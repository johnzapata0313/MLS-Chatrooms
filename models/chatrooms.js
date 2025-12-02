const mongoose = require("mongoose");

const ChatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chatroom", ChatroomSchema);
