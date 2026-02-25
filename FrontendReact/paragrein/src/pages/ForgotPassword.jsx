import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import bgImage from "../assets/images/bg_login.png";
import logo from "../assets/images/logo_circle.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setSuccess(response.data?.message || "Reset link sent if the email exists.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to process request. Please try again."
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

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-4 sm:p-8 md:p-4 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-sm ml-4 sm:ml-8 md:ml-0 mr-4 sm:mr-6 md:mr-12 md:max-h-[460px]">
        <img
          src={logo}
          alt="Paragrein Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-500 mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your email and we will send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-500 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 font-medium mt-6">
          Remembered your password?{" "}
          <Link to="/" className="text-green-500 font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
