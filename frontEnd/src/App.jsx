// App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from './components/Layout/Layout';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgotPassword from './components/pages/ForgotPassword';
import About from './components/pages/About';
import { ToastContainer } from "react-toastify";
import Verify from "./components/pages/Verify";
import VerificationCompleted from "./components/pages/VerificationCompleted";
import OtpVerify from "./components/pages/OtpVerify";
import ResetPassword from "./components/pages/ResetPassword";
import ResendVerification from "./components/pages/ResendVerification";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verify/" element={<Verify />} />
        <Route path="/verify/:token" element={<VerificationCompleted />} />
        <Route path="/otp-verification/:email" element={<OtpVerify />} />
        <Route path="/reset-password/:email/:otp" element={<ResetPassword />} />
        <Route path="/resend-verification" element={<ResendVerification />} />




      </Route>
    )
  );

  // ✅ Correctly return JSX here
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
