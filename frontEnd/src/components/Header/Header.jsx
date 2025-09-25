import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import { FaRegUser, FaHome } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { SiVectorlogozone } from "react-icons/si";
import { useDispatch } from "react-redux";
import { logoutUser, reset } from "../../features/authSlicer"; // Adjust path as needed

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUserFunction = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // unwrap to handle promise rejection
      console.log("APi Hit")
      dispatch(reset()); // reset auth state flags if needed
      navigate("/login"); // redirect to login page after logout
    } catch (error) {
      console.error("Failed to logout:", error);
      // You can show a toast or alert here if needed
    }
  };

  return (
    <header className="shadow-md bg-white">
      <nav className="flex items-center justify-between px-20 py-4">
        <div className="text-5xl ">
          <SiVectorlogozone />
        </div>
        <ul className="flex space-x-30">
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-red-600" : "text-black"}`
              }
            >
              <IoIosLogIn />
              Login
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-red-600" : "text-black"}`
              }
            >
              <FaRegUser />
              Register
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-red-600" : "text-black"}`
              }
            >
              <FaHome />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? "text-red-600" : "text-black"}`
              }
            >
              <FiAlertCircle />
              About
            </NavLink>
          </li>

          <li>
            <button onClick={logoutUserFunction} className="text-black hover:text-red-600">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
