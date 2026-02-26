import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavbarProps {
  user: any;
  logout: () => void;
}

const Navbar = ({ user, logout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 px-4 py-4 transition-all duration-500 ${
        scrolled
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      <nav
        className={`bg-white/95 backdrop-blur-md shadow-xl max-w-7xl mx-auto transition-all ${
          mobileMenuOpen ? "rounded-2xl" : "rounded-full md:rounded-full"
        }`}
      >
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              RescuePlate
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-2 py-2 gap-2">
              <Link
                to="/"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isActive("/")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isActive("/about")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isActive("/contact")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Welcome, {user.name}
                  </span>
                  {user.role === "VENDOR" && (
                    <Link
                      to="/vendor-dashboard"
                      className="bg-primary/10 text-primary px-6 py-2 rounded-full hover:bg-primary/20 transition font-medium"
                    >
                      My Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-primary/50 transition font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 pt-2 space-y-2"
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  isActive("/")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  isActive("/about")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  isActive("/contact")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Contact
              </Link>

              {user ? (
                <>
                  <div className="px-4 py-2 text-gray-600 text-sm">
                    Welcome, {user.name}
                  </div>
                  {user.role === "VENDOR" && (
                    <Link
                      to="/vendor-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                    >
                      My Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
