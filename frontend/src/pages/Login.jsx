import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import bgImage from "../assets/images/bg_login.png";
import logo from "../assets/images/logo_circle.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = nic.trim()
        ? {
            email: email.trim(),
            nic: nic.trim(),
            password,
          }
        : {
            identifier: email.trim(),
            password,
          };

      const response = await axios.post("/api/auth/login", payload);

      const { token, role, name, message } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name || "");
      localStorage.setItem("loginMessage", message || "");

      const roleRouteMap = {
        ADMIN: "/dashboard",
        CUSTOMER: "/customer-dashboard",
        DRIVER: "/driver-dashboard",
        WAREHOUSE: "/warehouse-dashboard",
        FINANCE: "/finance-dashboard",
        OPERATIONS: "/operations-dashboard",
      };

      navigate(roleRouteMap[role] || "/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen py-10 flex items-center justify-center sm:justify-start px-4 sm:px-8 md:px-16 relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-4 sm:p-8 md:p-4 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-sm ml-4 sm:ml-8 md:ml-0 mr-4 sm:mr-6 md:mr-12 md:max-h-[480px]">
        <img
          src={logo}
          alt="Paragrein Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-500 mb-6">
          Paragrein
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              NIC (workers only)
            </label>
            <input
              type="text"
              placeholder="Enter NIC if you are a worker"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-between text-sm text-green-500">
            <label className="flex items-center gap-2 relative">
              <input
                type="checkbox"
                className="peer appearance-none w-4 h-4 border-2 border-green-500 rounded bg-transparent cursor-pointer transition-all duration-200 checked:bg-green-500 checked:border-green-500"
              />
              <svg
                className="w-4 h-4 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="hover:underline cursor-pointer">
                Remember me
              </span>
            </label>
            <Link to="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300 shadow-md hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 font-medium mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
