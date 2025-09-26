import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendVerificationLink, reset } from "../../features/authSlicer";
import { toast } from "react-toastify";

function ResendVerification() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess) {
      toast.success(message);
      dispatch(reset());
      setEmail(""); // Clear email input on success
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    dispatch(resendVerificationLink({ email }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Resend Verification Email
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </button>
        </form>

        {isError && (
          <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>
        )}

        {isSuccess && (
          <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ResendVerification;
