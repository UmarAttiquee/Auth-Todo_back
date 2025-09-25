import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";
const API_URL_REGISTER = `${API_BASE_URL}/register`;
const API_URL_LOGOUT = `${API_BASE_URL}/logout`;

// 🔐 Register User
const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL_REGISTER, userData);

    const user = response.data;

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

// 🚪 Logout User
const logoutUser = async () => {
  console.log("▶ logoutUser() called");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    console.warn("⚠ No valid token found. Logging out locally.");
    localStorage.removeItem("user");
    return { message: "Logged out locally (no token)" };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  console.log("▶ Sending logout request with config:", config);

  try {
    const response = await axios.post(API_URL_LOGOUT, {}, config);

    localStorage.removeItem("user");

    console.log("✅ Logout successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Logout failed:", error.response?.data || error.message);
    throw error;
  }
};

const authService = {
  registerUser,
  logoutUser,
};

export default authService;
