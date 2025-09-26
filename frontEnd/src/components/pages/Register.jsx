import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaRegUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, reset } from '../../features/authSlicer';
import Spinner from '../Spinner';
import ResendVerification from './ResendVerification';

function RegistrationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChangeFunction = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const userData = { name, email, password };
    dispatch(registerUser(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed");
    }

    // When registration succeeds and user with token exists, navigate to verify page
    if (isSuccess && user && user.token) {
      toast.success("Registered successfully, please verify your email");
      navigate(`/verify`);
    }

    // Reset auth state to clear flags & messages
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="flex items-center justify-center text-2xl font-semibold gap-3 mb-6">
          <FaRegUser />
          Registration Form
        </h1>

        <form autoComplete="off" onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Enter Your Name"
            onChange={onChangeFunction}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />

          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter Your Email"
            onChange={onChangeFunction}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="off"
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={password}
              placeholder="Enter Your Password"
              onChange={onChangeFunction}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((prev) => !prev)}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-500"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Register
          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?
          <NavLink to="/login" className="text-amber-600 hover:underline ml-1">
            Login here
          </NavLink>
        </p>
      </section>
    </div>
  );
}

export default RegistrationForm;
