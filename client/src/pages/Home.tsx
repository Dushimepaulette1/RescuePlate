import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "HUMAN" | "ANIMAL";
  quantity: string;
  pickupTime: string;
  vendorId: {
    name: string;
    email: string;
  };
}

const Home = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { user, logout } = authContext;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await api.get("/listings");
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              RescuePlate
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-300">Welcome, {user.name}</span>
                  {user.role === "VENDOR" && (
                    <Link
                      to="/vendor-dashboard"
                      className="bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition"
                    >
                      My Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-primary transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Save Food,
              </span>
              <br />
              <span className="text-white">Save Money</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover delicious meals from local restaurants at discounted
              prices. Help reduce food waste while enjoying quality food.
            </p>
            {!user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 justify-center"
              >
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition"
                >
                  Learn More
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Available Food
            </h2>
            <p className="text-gray-400">Fresh listings from local vendors</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">
                No listings available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {listing.vendorId.name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        listing.category === "HUMAN"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {listing.category}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        ${listing.price}
                      </span>
                      {listing.originalPrice && (
                        <span className="text-gray-500 line-through">
                          ${listing.originalPrice}
                        </span>
                      )}
                    </div>
                    {listing.originalPrice && (
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-semibold">
                        {Math.round(
                          ((listing.originalPrice - listing.price) /
                            listing.originalPrice) *
                            100,
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-400">
                      <span className="font-semibold text-white mr-2">
                        Quantity:
                      </span>
                      {listing.quantity}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="font-semibold text-white mr-2">
                        Pickup:
                      </span>
                      {listing.pickupTime}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
