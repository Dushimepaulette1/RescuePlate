import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "HUMAN" | "ANIMAL";
  quantity: string;
  pickupTime: string;
  image: string;
  phoneNumber?: string;
  pickedUp?: boolean;
  pickedUpBy?: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  pickedUpAt?: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

const Home = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayCount, setDisplayCount] = useState(9);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { user, logout } = authContext;

  const features = [
    {
      title: "Quality Food",
      description:
        "Get delicious meals from top amazing restaurants In Kigali at discounted prices",
      icon: (
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Save Money",
      description:
        "Enjoy up to 70% off on surplus food that would otherwise go to waste",
      icon: (
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Help Planet",
      description:
        "Reduce food waste and make a positive impact on the environment By using our platform",
      icon: (
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (!user) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % features.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [user, features.length]);

  const fetchListings = async () => {
    try {
      const response = await api.get("/listings");

      
      const availableListings = response.data.filter(
        (listing: Listing) =>
          !listing.pickedUp ||
          (listing.pickedUp && listing.pickedUpBy?._id === user?.id),
      );
      setListings(availableListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (listingId: string) => {
    if (!user) {
      alert("Please login to pickup food items");
      return;
    }

    if (!confirm("Are you sure you want to pickup this item?")) return;

    try {
      await api.patch(`/listings/${listingId}/pickup`);
      fetchListings();
      alert(
        "Successfully marked as picked up! Check the listing card below for vendor contact details to arrange pickup.",
      );
    } catch (error: any) {
      console.error("Error marking as picked up:", error);
      alert(error.response?.data?.message || "Failed to mark as picked up");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} logout={logout} />

      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
          style={{ backgroundImage: "url(/pizza-hero.jpg)" }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

        <section className="relative py-20 px-4 z-10">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
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

        {!user && (
          <section className="py-20 px-4 relative" id="features-section">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">
                Why Choose RescuePlate?
              </h2>
              <p className="text-xl text-gray-400 text-center mb-16">
                Join thousands of people reducing food waste while saving money
              </p>

              <div className="relative h-96 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="backdrop-blur-lg rounded-3xl p-12 md:p-16 border-2 border-white/20 hover:border-primary/50 transition-all w-full max-w-3xl shadow-2xl">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-primary mb-8">
                          {features[currentSlide].icon}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                          {features[currentSlide].title}
                        </h3>
                        <p className="text-xl text-gray-300 leading-relaxed">
                          {features[currentSlide].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-primary w-8"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === 0 ? features.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
                  aria-label="Previous slide"
                >
                  <svg
                    className="w-6 h-6 text-white"
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
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % features.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
                  aria-label="Next slide"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Available Food
              </h2>
              <p className="text-gray-400">Fresh listings from local vendors</p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">
                  No listings available yet. Check back soon!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.slice(0, displayCount).map((listing, index) => (
                    <ListingCard
                      key={listing._id}
                      listing={listing}
                      index={index}
                      showVendorInfo={
                        listing.pickedUp && listing.pickedUpBy?._id === user?.id
                      }
                      onAction={handlePickup}
                      actionLabel={
                        listing.pickedUp ? "Already Picked Up" : "Pickup"
                      }
                      actionDisabled={listing.pickedUp}
                    />
                  ))}
                </div>

                {displayCount < listings.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-12"
                  >
                    <button
                      onClick={() => setDisplayCount((prev) => prev + 9)}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all transform hover:scale-105"
                    >
                      Load More Listings
                    </button>
                    <p className="text-gray-400 mt-4 text-sm">
                      Showing {displayCount} of {listings.length} listings
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
