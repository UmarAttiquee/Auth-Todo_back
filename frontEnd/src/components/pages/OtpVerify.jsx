import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, reset } from "../../features/authSlicer";
import { useNavigate, useParams } from "react-router-dom";

function OtpVerify() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useParams(); // Get email from URL params

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      alert("OTP verified successfully!");
      dispatch(reset());
      setTimeout(() => {
        navigate(`/reset-password/${email}/${otp}`);
      }, 2000);
    }

    if (isError) {
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    }
  }, [isSuccess, isError, dispatch, navigate, email, otp]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    dispatch(verifyOtp({ email, otp }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">OTP Verification</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="mb-2 text-center">
            Verification for: <strong>{email}</strong>
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {isError && (
          <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>
        )}

        {isSuccess && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            OTP verified successfully! Redirecting...
          </p>
        )}
      </div>
    </div>
  );
}

export default OtpVerify;
