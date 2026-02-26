import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import ErrorAlert from "../components/ErrorAlert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex items-end justify-start px-4 py-12 relative h-[95vh]"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-12 mb-20 lg:-ml-48 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition"
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
                <span>Back</span>
              </button>
              <Link
                to="/"
                className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition"
              >
                RescuePlate
              </Link>
            </div>

            {error && (
              <div className="mb-6">
                <ErrorAlert message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pb-3 border-b-2 border-primary focus:outline-none focus:border-secondary text-gray-800 text-lg placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pb-3 pr-10 border-b-2 border-gray-300 focus:outline-none focus:border-primary text-gray-800 text-lg placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-gray-400 hover:text-gray-600 transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.697 6.697m7.081 7.081l3.181 3.182m0 0a10.05 10.05 0 002.064-2.134m-2.064 2.134l-4.242-4.243M21 12a9.973 9.973 0 00-1.563-3.029M3 3l18 18"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

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
