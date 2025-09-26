let express = require("express");
const yupSchema = require("../validation/yupSchema.js");
const validate = require("../middleware/validate.js");
const {
  registerUser,
  verifyUser,
  login,
  resendVerificationLink,
  logout,
  forgetPassword,
  resetPassword,
  verifyOtp,
} = require("../controller/userController");
const isAuth = require("../middleware/isAuth");
let userRouter = express.Router();

userRouter.post("/register", validate(yupSchema), registerUser);
userRouter.post("/resendVerificationLink", resendVerificationLink);
userRouter.get("/verify", verifyUser);
userRouter.post("/login", login);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.post("/otp/:email", verifyOtp);

userRouter.post("/reset-password/:email/:otp", resetPassword);
userRouter.post("/logout", isAuth, logout);

module.exports = userRouter;
