import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Load user from localStorage if exists
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",

  verificationStatus: null, // "pending" | "success" | "failed" | null

  // Forgot password states
  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: false,
  forgotPasswordMessage: "",

  // Resend verification link states
  resendVerificationLoading: false,
  resendVerificationSuccess: false,
  resendVerificationError: false,
  resendVerificationMessage: "",
};

// ======= Async Thunks =======

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const user = await authService.registerUser(userData);
      return user;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const user = await authService.loginUser(userData);
      return user;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logoutUser();
      return;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify User Email
export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (token, thunkAPI) => {
    try {
      const result = await authService.verifyUser(token);
      return result;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const data = await authService.verifyOtp({ email, otp });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          error ||
          "OTP verification failed"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword, confirmPassword }, thunkAPI) => {
    try {
      const data = await authService.resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Password reset failed"
      );
    }
  }
);

// Resend Verification Link
export const resendVerificationLink = createAsyncThunk(
  "auth/resendVerificationLink",
  async ({ email }, thunkAPI) => {
    try {
      // ✅ Pass as object
      const data = await authService.resendVerificationLink({ email });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Resend verification failed"
      );
    }
  }
);

// ======= Slice =======
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.verificationStatus = null;

      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = false;
      state.forgotPasswordError = false;
      state.forgotPasswordMessage = "";

      state.resendVerificationLoading = false;
      state.resendVerificationSuccess = false;
      state.resendVerificationError = false;
      state.resendVerificationMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "User registered successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "User logged in successfully";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.message = "User logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Verify Email
      .addCase(verifyUser.pending, (state) => {
        state.verificationStatus = "pending";
        state.message = "";
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.verificationStatus = "success";
        state.message = action.payload.message || "Email verified";
        if (state.user) {
          state.user.isVerify = true;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.verificationStatus = "failed";
        state.message = action.payload || "Email verification failed";
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError = false;
        state.forgotPasswordMessage = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
        state.forgotPasswordMessage =
          action.payload.message || "Reset link sent.";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = true;
        state.forgotPasswordMessage =
          action.payload || "Failed to send reset link.";
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || "OTP verified successfully";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "OTP verification failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Password reset failed";
      })

      // Resend Verification Link
      .addCase(resendVerificationLink.pending, (state) => {
        state.resendVerificationLoading = true;
        state.resendVerificationSuccess = false;
        state.resendVerificationError = false;
        state.resendVerificationMessage = "";
      })
      .addCase(resendVerificationLink.fulfilled, (state, action) => {
        state.resendVerificationLoading = false;
        state.resendVerificationSuccess = true;
        state.resendVerificationError = false;
        state.resendVerificationMessage =
          action.payload.message || "Verification email resent";
      })
      .addCase(resendVerificationLink.rejected, (state, action) => {
        state.resendVerificationLoading = false;
        state.resendVerificationSuccess = false;
        state.resendVerificationError = true;
        state.resendVerificationMessage =
          action.payload || "Failed to resend verification email";
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
