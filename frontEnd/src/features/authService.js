import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const endpoints = {
  register: `${API_BASE_URL}/register`,
  login: `${API_BASE_URL}/login`,
  logout: `${API_BASE_URL}/logout`,
  verify: `${API_BASE_URL}/verify`,
  forgotPassword: `${API_BASE_URL}/forgetPassword`,
};

// Register User
const registerUser = async (userData) => {
  try {
    const response = await axios.post(endpoints.register, userData);
    const user = response.data.data;

    // Store user with tokens in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    console.log("✅ User registered and stored in localStorage:", user);
    return user;
  } catch (error) {
    console.error(
      "❌ Error during user registration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Login User
const loginUser = async (userData) => {
  try {
    const response = await axios.post(endpoints.login, userData);
    const user = response.data.data;

    // Store user with tokens in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    console.log("✅ User logged in and stored in localStorage:", user);
    return user;
  } catch (error) {
    console.error(
      "❌ Error during user login:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Logout User
const logoutUser = async () => {
  console.log("▶ logoutUser() called");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  if (!token) {
    console.warn("⚠ No valid token found. Logging out locally.");
    localStorage.removeItem("user");
    return { message: "Logged out locally (no token)" };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log("▶ Sending logout request with config:", config);

  try {
    const response = await axios.post(endpoints.logout, {}, config);

    localStorage.removeItem("user");

    console.log("✅ Logout successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Logout failed:", error.response?.data || error.message);
    throw error;
  }
};

// Verify User Email
const verifyUser = async (token) => {
  try {
    const response = await axios.get(endpoints.verify, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Verification error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || error.message || "Verification failed"
    );
  }
};

// Forgot Password - Send reset link to email
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(endpoints.forgotPassword, { email });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Forgot password error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// authService.js

const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/otp/${email}`, { otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || "OTP verification failed";
  }
};

const resetPassword = async ({ email, otp, newPassword, confirmPassword }) => {
  const response = await axios.post(
    `${API_BASE_URL}/reset-password/${encodeURIComponent(email)}/${otp}`,
    { newPassword, confirmPassword }
  );
  return response.data;
};

const resendVerificationLink = async ({ email }) => {
  try {
    console.log("📤 Sending request to resend verification link...");

    const response = await axios.post(
      `${API_BASE_URL}/resendVerificationLink`,
      {
        email,
      }
    );

    console.log("✅ Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error while resending verification link:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Re-throw to handle it in Redux thunk or UI
    throw error;
  }
};

const authService = {
  registerUser,
  loginUser,
  resetPassword,
  resendVerificationLink,
  verifyOtp,
  logoutUser,
  verifyUser,
  forgotPassword,
};

export default authService;
