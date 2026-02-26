import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import ErrorAlert from "../components/ErrorAlert";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"VENDOR" | "CUSTOMER">("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: "/signup1.jpg", text: "Need some Pizza, yo?" },
    { image: "/signup2.jpg", text: "Fresh Food Delivered" },
    { image: "/signup3.jpg", text: "Join RescuePlate Today" },
  ];

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { register } = authContext;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center items-center p-6"
            >
              <div className="relative w-full h-full">
                <div
                  className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url('${slides[currentSlide].image}')`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-white text-4xl font-bold mb-2">
                      {slides[currentSlide].text}
                    </h2>
                    <p className="text-white/90 text-lg">
                      C'mon and order from nearby Pizza delivery and pickup
                      restaurants
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-3 rounded-full transition-all ${
                        index === currentSlide
                          ? "w-8 bg-primary"
                          : "w-3 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex items-end justify-start px-4 py-12 relative h-[95vh]"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-12 mb-20 lg:-ml-48 relative z-10">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Gouse Mohammed"
                  className="w-full pb-3 border-b-2 border-primary focus:outline-none focus:border-secondary text-gray-800 text-lg placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pb-3 border-b-2 border-gray-300 focus:outline-none focus:border-primary text-gray-800 text-lg placeholder-gray-400"
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.697 6.697m7.081 7.081l3.181 3.182m0 0a10.05 10.05 0 002.064-2.134m-2.064 2.134l-4.242-4.243M21 12a9.973 9.973 0 00-1.563-3.029M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setRole("CUSTOMER")}
                    className={`py-3 px-4 rounded-lg border-2 transition font-medium ${
                      role === "CUSTOMER"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-gray-50 border-gray-300 text-gray-600"
                    }`}
                  >
                    Customer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setRole("VENDOR")}
                    className={`py-3 px-4 rounded-lg border-2 transition font-medium ${
                      role === "VENDOR"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-gray-50 border-gray-300 text-gray-600"
                    }`}
                  >
                    Vendor
                  </motion.button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-secondary transition font-semibold"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
