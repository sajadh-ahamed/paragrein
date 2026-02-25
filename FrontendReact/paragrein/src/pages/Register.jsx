import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import bgImage from "../assets/images/bg_login.png";
import logo from "../assets/images/logo_circle.png";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        address: formData.address,
      });

      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen py-10 flex items-center justify-center sm:justify-start px-4 sm:px-8 md:px-16 relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-4 sm:p-8 md:p-4 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-sm ml-4 sm:ml-8 md:ml-0 mr-4 sm:mr-6 md:mr-12">
        <img
          src={logo}
          alt="Paragrein Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-500 mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Address
            </label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows="2"
              placeholder="Enter your address"
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg transition-all duration-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-green-500 bg-white/10 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300 shadow-md hover:scale-105"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 font-medium mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-green-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
