import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import ErrorAlert from "../components/ErrorAlert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { login } = authContext;

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required";
    }
    if (!email.includes("@")) {
      return "Please enter a valid email address with @";
    }
    const emailParts = email.split("@");
    if (emailParts[1] === "" || !emailParts[1]) {
      return "Please enter the domain after @";
    }
    if (!emailParts[1].includes(".")) {
      return "Please enter a valid email domain (e.g., gmail.com)";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent py-4">
      <div className="flex items-center justify-center w-full max-w-7xl mx-auto">
      {/* Left Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative h-[95vh]"
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
          <div className="relative w-full h-full">
            <div
              className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
              style={{ backgroundImage: "url('/loginImage.png')" }}
            >
              <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-end justify-start px-4 py-12 relative h-[95vh]"
      >
        {/* Form Card */}
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-12 mb-20 lg:-ml-48 relative z-10">

          {/* Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Home</span>
          </Link>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Username/Email Input */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">Username or Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full pb-3 border-b-2 border-primary focus:outline-none focus:border-secondary text-gray-800 text-lg placeholder-gray-400"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pb-3 border-b-2 border-gray-300 focus:outline-none focus:border-primary text-gray-800 text-lg placeholder-gray-400"
              required
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              New User?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:text-secondary transition"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Login;
