const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const UserModal = require("../modal/userModal.js");
const SessionModal = require("../modal/sessionModal.js");
const verifyEmail = require("../emailVerify/emailVeify.js");
const otpEmail = require("../emailVerify/otpEmail.js");

// Register a new users
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the fields",
      });
    }

    const emailLower = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 15);

    const existingUser = await UserModal.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    const user = await UserModal.create({
      name,
      email: emailLower,
      password: passwordHash,
      isVerify: false,
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m", // 30 seconds for email verification token
    });

    user.token = token;
    await user.save();

    // Send verification email with token
    verifyEmail(emailLower, token);

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Verify user email via token
const verifyUser = async (req, res) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token;
    } else {
      return res.status(400).json({
        status: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await UserModal.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    user.isVerify = true;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "User verified successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// User login and session creation
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the fields",
      });
    }

    const emailLower = email.toLowerCase();
    const user = await UserModal.findOne({ email: emailLower });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Unauthenticated email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Unauthenticated password",
      });
    }

    if (!user.isVerify) {
      return res.status(403).json({
        status: false,
        message: "User is not verified yet",
      });
    }

    const jti = new mongoose.Types.ObjectId().toString();

    const accessToken = jwt.sign(
      { id: user._id, jti },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "20m",
    });

    // Delete old session(s) if any
    await SessionModal.deleteMany({ UserID: user._id });

    // Create new session
    await SessionModal.create({ UserID: user._id, jti });

    user.token = accessToken;
    user.refreshToken = refreshToken;
    user.isLoggin = true;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Logout user and delete session
const logout = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const session = req.session;

    // Delete all sessions for the user (optional: could limit to current session)
    await SessionModal.deleteMany({ UserID: userId });

    // Delete current session explicitly
    await SessionModal.deleteOne({ _id: session._id });

    await UserModal.findByIdAndUpdate(userId, { isLoggin: false });

    user.token = null;
    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Resend verification email
const resendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Please enter your email",
      });
    }

    const emailLower = email.toLowerCase();
    const user = await UserModal.findOne({ email: emailLower });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (user.isVerify) {
      return res.status(400).json({
        status: false,
        message: "User is already verified",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    user.token = token;
    await user.save();

    verifyEmail(emailLower, token);

    return res.status(200).json({
      status: true,
      message: "Verification email resent",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Request password reset: send OTP email
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Please enter your email",
      });
    }

    const emailLower = email.toLowerCase();
    const user = await UserModal.findOne({ email: emailLower });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (!user.isVerify) {
      return res.status(403).json({
        status: false,
        message: "User is not verified",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    user.token = token;
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpAttempts = 0; // Reset OTP attempts
    await user.save();

    otpEmail(emailLower, token, otp, otpExpiry);

    return res.status(200).json({
      status: true,
      message: "OTP sent to your email address",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    // Validate required fields
    if (!otp) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the fields",
      });
    }

    const user = await UserModal.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // OTP attempt limit
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        status: false,
        message: "Too many incorrect OTP attempts. Please request again.",
      });
    }

    // Use string comparison to avoid leading zero issues
    if (
      String(user.otp) !== String(otp) ||
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    ) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        status: false,
        message: "Invalid or expired OTP",
        attemptsRemaining: Math.max(0, 5 - user.otpAttempts),
      });
    }

    // All good: update password
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    user.token = null;

    // Delete all sessions
    await SessionModal.deleteMany({ UserID: user._id });

    await user.save();

    return res.status(200).json({
      status: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
// Reset password with OTP

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;

    // Validate required fields
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Please fill all the fields",
      });
    }

    // Password match check
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match",
      });
    }

    // Optional: Password strength check
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await UserModal.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // All good: update password
    user.password = await bcrypt.hash(newPassword, 15);
    user.otp = null;
    user.otpExpiry = null;

    user.token = null;

    // Delete all sessions
    await SessionModal.deleteMany({ UserID: user._id });

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  login,
  logout,
  resendVerificationLink,
  forgetPassword,
  verifyOtp,
  resetPassword,
};
