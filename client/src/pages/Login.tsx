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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/loginImage.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 text-white hover:text-primary transition"
      >
        <svg
          className="w-8 h-8"
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
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          {/* Fruit Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg
                className="w-32 h-32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Leaves */}
                <path
                  d="M35 15 Q30 10, 25 15 Q30 20, 35 15"
                  fill="#4A5568"
                  stroke="#4A5568"
                  strokeWidth="2"
                />
                <path
                  d="M50 10 Q45 5, 40 10 Q45 15, 50 10"
                  fill="#4A5568"
                  stroke="#4A5568"
                  strokeWidth="2"
                />
                <path
                  d="M65 15 Q70 10, 75 15 Q70 20, 65 15"
                  fill="#4A5568"
                  stroke="#4A5568"
                  strokeWidth="2"
                />
                {/* Main fruit circles */}
                <circle cx="35" cy="45" r="22" fill="#FF8C42" stroke="#4A5568" strokeWidth="3" />
                <circle cx="65" cy="45" r="22" fill="#FF8C42" stroke="#4A5568" strokeWidth="3" />
                {/* Stems */}
                <line x1="35" y1="23" x2="35" y2="15" stroke="#4A5568" strokeWidth="3" />
                <line x1="65" y1="23" x2="50" y2="10" stroke="#4A5568" strokeWidth="3" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">User Login</h1>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Username/Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              className="w-full pl-14 pr-4 py-4 bg-[#F5E6D3] border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-600 font-medium"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-14 pr-4 py-4 bg-[#F5E6D3] border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-600 font-medium"
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-white text-lg">
              New User?{" "}
              <Link
                to="/register"
                className="font-bold underline hover:text-primary transition"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#D4915A] border-2 border-primary text-white font-bold text-lg rounded-full hover:bg-primary transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
