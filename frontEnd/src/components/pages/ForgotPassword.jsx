// src/components/auth/ForgotPassword.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, reset } from "../../features/authSlicer";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api/forgetPassword"; // Adjust your route


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {
    forgotPasswordLoading,
    forgotPasswordSuccess,
    forgotPasswordError,
    forgotPasswordMessage,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (forgotPasswordError) {
      toast.error(forgotPasswordMessage);
      dispatch(reset());
    }

    if (forgotPasswordSuccess) {
      toast.success(forgotPasswordMessage);
      dispatch(reset());
      setTimeout(() => {
        navigate(`/otp-verification/${email}`);
      }, 2000)// pass email here
    }
  }, [forgotPasswordError, forgotPasswordSuccess, forgotPasswordMessage, dispatch, navigate, email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={forgotPasswordLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

