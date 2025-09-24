const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 16955632123.jpg
  },
});
const upload = multer({ storage });

const express = require("express");
const postRoute = express.Router();
const {
  createPost,
  showAll,
  delOne,
  delAll,
  updatePost,
  showOne,
} = require("../controller/userPostController");

// Route to upload post with image
postRoute.post("/uploads", upload.single("image"), createPost);
postRoute.get("/showall", showAll);
postRoute.get("/showone/:postId", showOne);
postRoute.post("/delone/:postId", delOne);
postRoute.post("/delall", delAll);
postRoute.put("/posts/update/:postId", upload.single("image"), updatePost);

module.exports = postRoute;
