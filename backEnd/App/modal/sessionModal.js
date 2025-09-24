const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModalCollection", // or "User" if renamed
    required: true,
  },
  jti: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // Document auto-deletes after 30 minutes (TTL)
  },
});

const SessionModal = mongoose.model("SessionModalCollection", sessionSchema);
module.exports = SessionModal;
