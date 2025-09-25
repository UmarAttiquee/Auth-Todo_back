const UserPostModal = require("../modal/userPostModal");
const UserModal = require("../modal/userModal"); // Assuming you have a user model
const fs = require("fs");
const path = require("path");
const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { userId } = req.params; // User making the request
    const { token } = req.params; // User making the request

    // Check all required fields including image file
    if (!title || !description || !userId || !req.file || !token) {
      return res.status(400).json({
        status: false,
        message: "All fields (title, description, userId, image) are required",
      });
    }

    // Check if user is logged in (assuming you have a 'isLoggedIn' flag in User model)
    // You can adjust this check based on how you handle user sessions/authentication
    const user = await UserModal.findById(userId);
    if (!user || !user.isLoggin) {
      return res.status(401).json({
        status: false,
        message: "User must be logged in to create a post",
      });
    }

    // Check if post title already exists for the same user (optional: or globally)
    const existingPost = await UserPostModal.findOne({ title });
    if (existingPost) {
      return res.status(409).json({
        status: false,
        message: "Post with this title already exists",
      });
    }

    // Create new post
    const post = await UserPostModal.create({
      title,
      description,
      userId,
      image: req.file.path, // multer file path
    });

    return res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const showAll = async (req, res) => {
  try {
    const { userId } = req.params; // User making the request

    // Validate userId presence
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    // Check if user exists and is logged in
    const user = await UserModal.findById(userId);
    if (!user || !user.isLoggin) {
      // Make sure 'isLoggin' is the right field name
      return res.status(401).json({
        status: false,
        message: "User must be logged in to view posts",
      });
    }

    // Get posts for this user
    const posts = await UserPostModal.find({ userId });

    return res.status(200).json({
      status: true,
      message: posts.length ? "Posts found" : "No posts found",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const showOne = async (req, res) => {
  try {
    const { userId } = req.params; // User making the request
    const { postId } = req.params; // ID of the post to fetch

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    if (!postId) {
      return res.status(400).json({
        status: false,
        message: "postId is required",
      });
    }

    // Check if user exists and is logged in
    const user = await UserModal.findById(userId);
    if (!user || !user.isLoggin) {
      return res.status(401).json({
        status: false,
        message: "User must be logged in to view posts",
      });
    }

    // Find post by postId
    const post = await UserPostModal.findById(postId);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Post found",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const delOne = async (req, res) => {
  try {
    const { userId } = req.body; // User making the request
    const { postId } = req.params; // ID of the post to delete

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    if (!postId) {
      return res.status(400).json({
        status: false,
        message: "postId is required",
      });
    }

    // Check if user exists and is logged in
    const user = await UserModal.findById(userId);
    if (!user || !user.isLoggin) {
      return res.status(401).json({
        status: false,
        message: "User must be logged in to delete posts",
      });
    }

    // Find post by postId
    const post = await UserPostModal.findById(postId);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    // Optional: Verify the user owns the post before deleting
    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to delete this post",
      });
    }

    if (post.image) {
      const imagePath = path.resolve(post.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete post image:", err);
        } else {
          console.log("Post image deleted:", imagePath);
        }
      });
    }
    await post.deleteOne();
    // Delete the post

    return res.status(200).json({
      status: true,
      message: "Post deleted successfully from database",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const delAll = async (req, res) => {
  try {
    const { userId } = req.body; // User making the request

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    // Check if user exists and is logged in
    const user = await UserModal.findById(userId);
    if (!user || !user.isLoggin) {
      return res.status(401).json({
        status: false,
        message: "User must be logged in to delete posts",
      });
    }

    const posts = await UserPostModal.find({ userId });
    posts.forEach((post) => {
      if (post.image) {
        const imagePath = path.resolve(post.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete post image:", err);
          } else {
            console.log("Post image deleted:", imagePath);
          }
        });
      }
    });

    // Delete all posts belonging to this user
    const deleteResult = await UserPostModal.deleteMany({ userId });

    return res.status(200).json({
      status: true,
      message: `Deleted ${deleteResult.deletedCount} posts successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const { postId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    if (!postId) {
      return res.status(400).json({
        status: false,
        message: "postId is required",
      });
    }

    // Check if user exists and is logged in
    const user = await UserModal.findById(userId);
    if (!user || !user.isLoggin) {
      return res.status(401).json({
        status: false,
        message: "User must be logged in to update posts",
      });
    }

    // Find post by id
    const post = await UserPostModal.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    // Check if the user owns the post
    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to update this post",
      });
    }

    // Optional: If title is being updated, check for duplicates
    if (title && title !== post.title) {
      const existingPost = await UserPostModal.findOne({ title });
      if (existingPost) {
        return res.status(409).json({
          status: false,
          message: "Another post with this title already exists",
        });
      }
      post.title = title;
    }

    // Update description if provided
    if (description) {
      post.description = description;
    }

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image file if exists
      if (post.image) {
        const oldImagePath = path.resolve(post.image); // Make sure path is absolute or relative to your server root

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
            // You might want to log the error but not block the update operation
          } else {
            console.log("Old image deleted:", oldImagePath);
          }
        });
      }

      // Set new image path
      post.image = req.file.path;
    }

    // Save updated post
    await post.save();

    return res.status(200).json({
      status: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createPost, showAll, showOne, delOne, delAll, updatePost };
