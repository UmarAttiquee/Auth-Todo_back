import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaRegUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, reset } from '../../features/authSlicer';
import Spinner from '../Spinner';
import ForgotPassword from './ForgotPassword';

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isUser, isLoading, isError, isSuccess, isMessage } = useSelector((state) => state.auth);

  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChangeFunction = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // ✅ Fixed: removed brackets []
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("You entered:", formData);

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    const userData = { email, password };
    dispatch(loginUser(userData));

    console.log("User Logiin Successfully")
  };


  useEffect(() => {
    if (isError) {
      toast.error(isMessage || "Login failed");
    }

    if (isSuccess) {
      toast.success("Login successfully");
      navigate('/home');
    }

    // Only reset after effects are triggered
    return () => {
      dispatch(reset());
    };
  }, [isUser, isError, isSuccess, isMessage, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className=" flex items-center justify-center  px-4 mt-40">
      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="font-bold text-3xl flex items-center justify-center gap-4 mb-6 text-gray-700">
          <FaRegUser />
          <span>Login</span>
        </h1>

        <form autoComplete="off" onSubmit={onSubmit} className="max-w-md w-full space-y-4 bg-white p-6 rounded-lg ">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChangeFunction}
            placeholder="Enter Your Email"
            autoComplete="new-email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type={showPass ? "text" : "password"}
            name="password"
            value={password}
            onChange={onChangeFunction}
            placeholder="Enter Your Password"
            autoComplete="new-password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button onClick={() => { setShowPass((prev) => !prev) }}>
            {showPass ? <FaEye /> : <FaEyeSlash />}
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Login
          </button>
          <button>
            <span className="text-amber-600 hover:underline ml-1">
              <NavLink to="/forgotPassword">ForgotPassword</NavLink>
            </span>
          </button>
          <button>
            <NavLink to="/resend-verification" className="text-amber-600 hover:underline ml-1">
              ResendVerification Link
            </NavLink>
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?
          <span className="text-amber-600 hover:underline ml-1">
            <NavLink to="/register">Register here</NavLink>
          </span>
        </p>
      </section>
    </div >
  );
}

export default Login;
