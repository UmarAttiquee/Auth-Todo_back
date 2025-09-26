import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import authService from "../../features/authService";

function VerificationCompleted() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Verification token not found.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyUser(token);

        if (response.status) {
          setVerified(true);
          toast.success("✅ Email verified successfully!");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setError(response.message || "Verification failed.");
        }
      } catch (err) {
        console.error("❌ Verification error:", err);
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="max-w-md bg-white p-6 rounded shadow text-center text-red-600">
          <h2 className="text-xl font-semibold mb-4">Verification Failed</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/register")}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="max-w-md bg-white p-6 rounded shadow text-center text-green-600">
          <h2 className="text-xl font-semibold mb-4">Verification Successful!</h2>
          <p>Your email has been verified successfully.</p>
          <p className="mt-4">Redirecting you to login...</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default VerificationCompleted;
