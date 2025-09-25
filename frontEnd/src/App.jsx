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


function App() {
  <ToastContainer />
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fotgotpassword" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />

      </Route>

    )
  );

  return <RouterProvider router={router} />;
}

export default App;
