import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import Lottie from "react-lottie";
import animationData from "../../lottie-animation/loginAnimation.json";
import { Context } from "../../Context/Context";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthe, setUser } = useContext(Context);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Patient"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          email,
          password,
          role
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data.data && response.data.data.user) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        setIsAuthe(true);
        setUser(response.data.data.user);
        toast.success(response.data.message || "Login successful");
        
        // Redirect to the page they were trying to access, or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        console.error("Invalid response:", response.data);
        toast.error("Login failed: Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] py-12">
      <Helmet>
        <title>Login - HospiTech</title>
        <meta name="description" content="Login to your HospiTech account" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Animation */}
          <div className="hidden md:block">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome Back!</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
            </label>
            <input
              type="email"
                  id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
            </label>
            <input
              type="password"
                  id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Login As
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

            <button
              type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Sign In
            </button>
          </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
            </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
