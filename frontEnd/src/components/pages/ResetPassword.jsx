import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, reset } from "../../features/authSlicer";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const { email, otp } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      alert(message || "Password reset successfully!");
      dispatch(reset());
      setTimeout(() => {
        navigate("/login");
      }, 2000)
    }
    if (isError) {
      alert(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    dispatch(resetPassword({ email, otp, newPassword, confirmPassword }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="mb-4 text-center text-sm text-gray-600">
            Reset password for <strong>{email}</strong>
          </p>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
