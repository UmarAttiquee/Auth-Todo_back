const mongoose = require("mongoose");

const userPosts = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModalCollection", // Update to match your user model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserPostModal = mongoose.model("UserPostsColection", userPosts);
module.exports = UserPostModal;
