const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./App/router/userRouter");
const postRouter = require("./App/router/postRouter");

const app = express(); // Use const here to avoid accidental override
app.use(express.json()); // To parse JSON bodies

require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173", // or whatever your frontend port is
    credentials: true,
  })
);
// Connect to MongoDB and start server
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("DB Connected Successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed:", error.message);
    process.exit(1); // Exit if DB connection fails
  });

app.use("/api", postRouter);
app.use("/api", userRouter);

// Use routers

// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const upload = multer({ storage });

// app.post("/uploads", upload.single("file"), (req, res) => {
//   res.json(req.file);
// });
