import { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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
  vendorId?: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

const VendorDashboard = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "HUMAN" as "HUMAN" | "ANIMAL",
    quantity: "",
    pickupTime: "",
    image: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { user, logout } = authContext;

  useEffect(() => {
    if (!user || user.role !== "VENDOR") {
      navigate("/");
      return;
    }
    fetchMyListings();
  }, [user, navigate]);

  const fetchMyListings = useCallback(async () => {
    try {
      const response = await api.get("/listings/my-listings");
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (warn if over 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is large and will be compressed to reduce upload size.");
      }

      // Compress and resize image
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const compressedImage = canvas.toDataURL("image/jpeg", 0.7);
          setFormData((prev) => ({ ...prev, image: compressedImage }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "HUMAN",
      quantity: "",
      pickupTime: "",
      image: "",
      phoneNumber: "",
    });
    setEditingListing(null);
    setShowCreateForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload a food image before creating the listing.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/listings", {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
      });
      await fetchMyListings();
      resetForm();
      alert(
        "✅ Listing created successfully!\n\nCustomers can now see it in the Available Food section on the homepage.",
      );
    } catch (error: any) {
      console.error("Error creating listing:", error);
      let errorMessage = "Failed to create listing";

      if (
        error.response?.status === 413 ||
        error.message?.includes("too large")
      ) {
        errorMessage =
          "Image is too large. Please try a smaller image or the system will compress it automatically.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(
        `❌ Error: ${errorMessage}\n\nPlease check all fields and try again.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    if (!formData.image) {
      alert("Please upload a food image before updating the listing.");
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/listings/${editingListing._id}`, {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
      });
      await fetchMyListings();
      resetForm();
      alert(
        "✅ Listing updated successfully!\n\nThe changes are now visible to customers.",
      );
    } catch (error: any) {
      console.error("Error updating listing:", error);
      let errorMessage = "Failed to update listing";

      if (
        error.response?.status === 413 ||
        error.message?.includes("too large")
      ) {
        errorMessage =
          "Image is too large. Please try a smaller image or the system will compress it automatically.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(
        `❌ Error: ${errorMessage}\n\nPlease check all fields and try again.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const startEdit = (listing: Listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      originalPrice: listing.originalPrice?.toString() || "",
      category: listing.category,
      quantity: listing.quantity,
      pickupTime: listing.pickupTime,
      image: listing.image || "",
      phoneNumber: listing.phoneNumber || "",
    });
    setShowCreateForm(true);
  };

  if (!user || user.role !== "VENDOR") {
    return null;
  }

  const totalListings = listings.length;
  const humanListings = listings.filter((l) => l.category === "HUMAN").length;
  const animalListings = listings.filter((l) => l.category === "ANIMAL").length;
  const totalRevenue = listings.reduce((sum, l) => sum + l.price, 0);
  const avgDiscount =
    listings
      .filter((l) => l.originalPrice)
      .reduce((sum, l) => {
        if (l.originalPrice) {
          return sum + ((l.originalPrice - l.price) / l.originalPrice) * 100;
        }
        return sum;
      }, 0) / listings.filter((l) => l.originalPrice).length || 0;

  return (
    <div className="min-h-screen">
      <Navbar user={user} logout={logout} />

      <div className="flex relative">
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-[85vw] max-w-xs sm:w-72 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-4 sm:p-6 overflow-y-auto z-40 lg:relative lg:top-0 lg:left-0 lg:h-auto lg:ml-6 lg:w-72"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Overview
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarOpen(false)}
                  className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition border border-white/20"
                  aria-label="Close sidebar"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-3 sm:p-4 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Total Listings
                    </span>
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {totalListings}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-3 sm:p-4 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Human Food
                    </span>
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
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
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {humanListings}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {totalListings > 0
                      ? Math.round((humanListings / totalListings) * 100)
                      : 0}
                    % of total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-3 sm:p-4 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Animal Feed
                    </span>
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {animalListings}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {totalListings > 0
                      ? Math.round((animalListings / totalListings) * 100)
                      : 0}
                    % of total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-3 sm:p-4 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Total Value
                    </span>
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
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
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Combined listing prices
                  </p>
                </div>

                {avgDiscount > 0 && (
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-3 sm:p-4 border border-primary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-xs sm:text-sm">
                        Avg. Discount
                      </span>
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {avgDiscount.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Average savings offered
                    </p>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-8" : "ml-0"} w-full`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSidebarOpen(true)}
                    className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition border border-white/20"
                    aria-label="Open sidebar"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </motion.button>
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    Vendor Dashboard
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Manage your food listings
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition whitespace-nowrap"
              >
                {showCreateForm ? "✕ Close" : "+ New"}
              </motion.button>
            </div>

            <AnimatePresence>
              {showCreateForm && (
                <>
                  {/* Backdrop blur overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowCreateForm(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                  />

                  {/* Modal form */}
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                    >
                      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-white">
                            {editingListing
                              ? "Edit Listing"
                              : "Create New Listing"}
                          </h2>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowCreateForm(false)}
                            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
                            type="button"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        </div>
                        <form
                          onSubmit={
                            editingListing ? handleUpdate : handleCreate
                          }
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                placeholder="e.g., 5 Large Pizzas"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Category
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      category: "HUMAN",
                                    }))
                                  }
                                  className={`py-3 px-4 rounded-lg border-2 transition font-semibold ${
                                    formData.category === "HUMAN"
                                      ? "bg-green-500/20 border-green-400 text-green-300"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                  }`}
                                >
                                  Human Consumption
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      category: "ANIMAL",
                                    }))
                                  }
                                  className={`py-3 px-4 rounded-lg border-2 transition font-semibold ${
                                    formData.category === "ANIMAL"
                                      ? "bg-blue-500/20 border-blue-400 text-blue-300"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                  }`}
                                >
                                  Animal Feed
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                              Description
                            </label>
                            <textarea
                              name="description"
                              required
                              value={formData.description}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                              placeholder="Describe your food..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Price ($)
                              </label>
                              <input
                                type="number"
                                name="price"
                                required
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                placeholder="12.99"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Original Price ($) - Optional
                              </label>
                              <input
                                type="number"
                                name="originalPrice"
                                step="0.01"
                                value={formData.originalPrice}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                placeholder="45.00"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Quantity
                              </label>
                              <input
                                type="text"
                                name="quantity"
                                required
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                placeholder="5 boxes"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Pickup Time
                              </label>
                              <input
                                type="text"
                                name="pickupTime"
                                required
                                value={formData.pickupTime}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                placeholder="Today 5:00 PM - 6:00 PM"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Food Image *{" "}
                                {!editingListing && (
                                  <span className="text-primary">
                                    (Required)
                                  </span>
                                )}
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary file:cursor-pointer"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Upload a clear image of your food item
                              </p>
                              {formData.image && (
                                <div className="mt-3">
                                  <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg border border-white/20"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                Contact Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                                placeholder="+1 (234) 567-8900"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                For customers to contact you for pickup
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <motion.button
                              whileHover={{ scale: submitting ? 1 : 1.02 }}
                              whileTap={{ scale: submitting ? 1 : 0.98 }}
                              type="submit"
                              disabled={submitting}
                              className={`flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition ${
                                submitting
                                  ? "opacity-50 blur-[1px] cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {submitting
                                ? editingListing
                                  ? "Updating listing..."
                                  : "Creating listing..."
                                : editingListing
                                  ? "Update Listing"
                                  : "Create Listing"}
                            </motion.button>
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">
                  No listings yet. Create your first listing!
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  sidebarOpen
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {listings.map((listing, index) => (
                  <motion.div
                    key={listing._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all"
                  >
                    {listing.image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                              listing.category === "HUMAN"
                                ? "bg-green-500/30 text-green-200 border border-green-400/50"
                                : "bg-blue-500/30 text-blue-200 border border-blue-400/50"
                            }`}
                          >
                            {listing.category}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">
                            {listing.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 text-sm sm:text-base break-words">
                        {listing.description}
                      </p>

                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          ${listing.price}
                        </span>
                        {listing.originalPrice && (
                          <>
                            <span className="text-gray-500 line-through">
                              ${listing.originalPrice}
                            </span>
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold">
                              {Math.round(
                                ((listing.originalPrice - listing.price) /
                                  listing.originalPrice) *
                                  100,
                              )}
                              % OFF
                            </span>
                          </>
                        )}
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="text-gray-400 break-words">
                          <span className="font-semibold text-white">
                            Quantity:
                          </span>{" "}
                          {listing.quantity}
                        </div>
                        <div className="text-gray-400 break-words">
                          <span className="font-semibold text-white">
                            Pickup:
                          </span>{" "}
                          {listing.pickupTime}
                        </div>
                        {listing.phoneNumber && (
                          <div className="text-gray-400 break-words">
                            <span className="font-semibold text-white">
                              Contact:
                            </span>{" "}
                            {listing.phoneNumber}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEdit(listing)}
                          className="flex-1 bg-primary/20 text-primary py-2 rounded-lg hover:bg-primary/30 transition font-semibold text-sm sm:text-base"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(listing._id)}
                          className="flex-1 bg-red-500/20 text-red-300 py-2 rounded-lg hover:bg-red-500/30 transition font-semibold text-sm sm:text-base"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
