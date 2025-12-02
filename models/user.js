const bcrypt = require('bcrypt')
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true, lowercase: true },
  password: String,
  favoriteTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  profilePic: { type: String, default: "/images/default-avatar.png" },
  balance: { type: Number, default: 1000 }, // Virtual betting currency
  createdAt: { type: Date, default: Date.now }
});

// Password hash middleware - runs before saving
UserSchema.pre("save", async function save(next) {
  const user = this;
  if (!user.isModified("password")) { return next(); }
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Helper method for validating user's password
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);