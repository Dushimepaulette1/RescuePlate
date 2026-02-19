import { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
}

const VendorDashboard = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "HUMAN" as "HUMAN" | "ANIMAL",
    quantity: "",
    pickupTime: "",
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "HUMAN",
      quantity: "",
      pickupTime: "",
    });
    setEditingListing(null);
    setShowCreateForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/listings", {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
      });
      fetchMyListings();
      resetForm();
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    try {
      await api.patch(`/listings/${editingListing._id}`, {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
      });
      fetchMyListings();
      resetForm();
    } catch (error) {
      console.error("Error updating listing:", error);
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
    });
    setShowCreateForm(true);
  };

  if (!user || user.role !== "VENDOR") {
    return null;
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              RescuePlate
            </button>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button
                onClick={() => navigate("/")}
                className="text-white hover:text-primary transition"
              >
                Home
              </button>
              <button
                onClick={logout}
                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-gray-400">Manage your food listings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition"
          >
            {showCreateForm ? "Cancel" : "+ Create Listing"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingListing ? "Edit Listing" : "Create New Listing"}
                </h2>
                <form
                  onSubmit={editingListing ? handleUpdate : handleCreate}
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
                          🍕 Human Consumption
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
                          🐾 Animal Feed
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

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition"
                    >
                      {editingListing ? "Update Listing" : "Create Listing"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {listing.title}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        listing.category === "HUMAN"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {listing.category}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{listing.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
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
                  <div className="text-gray-400">
                    <span className="font-semibold text-white">Quantity:</span>{" "}
                    {listing.quantity}
                  </div>
                  <div className="text-gray-400">
                    <span className="font-semibold text-white">Pickup:</span>{" "}
                    {listing.pickupTime}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startEdit(listing)}
                    className="flex-1 bg-primary/20 text-primary py-2 rounded-lg hover:bg-primary/30 transition font-semibold"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(listing._id)}
                    className="flex-1 bg-red-500/20 text-red-300 py-2 rounded-lg hover:bg-red-500/30 transition font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
