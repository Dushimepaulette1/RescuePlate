import { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { compressImage } from "../utils/formatters";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import ListingForm from "../components/ListingForm";
import ListingCard from "../components/ListingCard";
import StatCard from "../components/StatCard";

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData((prev) => ({ ...prev, image: compressedBase64 }));
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try again.");
      }
    }
  };

  const handleCategoryChange = (category: "HUMAN" | "ANIMAL") => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image for your listing");
      return;
    }

    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      alert("Please provide a contact phone number");
      return;
    }

    
    const phoneRegex = /^(\+?250|0)?[7][0-9]{8}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      alert(
        "Please enter a valid Rwandan phone number (e.g., +250788123456, 0788123456, or 788123456)",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/listings", {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
      });
      setListings([response.data, ...listings]);
      resetForm();
    } catch (error: any) {
      console.error("Error creating listing:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create listing. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      alert("Please provide a contact phone number");
      return;
    }

    
    const phoneRegex = /^(\+?250|0)?[7][0-9]{8}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      alert(
        "Please enter a valid Rwandan phone number (e.g., +250788123456, 0788123456, or 788123456)",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.patch(`/listings/${editingListing._id}`, {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
      });
      setListings(
        listings.map((l) => (l._id === editingListing._id ? response.data : l)),
      );
      resetForm();
    } catch (error: any) {
      console.error("Error updating listing:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update listing. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((l) => l._id !== id));
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete listing. Please try again.",
      );
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
      image: listing.image,
      phoneNumber: listing.phoneNumber || "",
    });
    setShowCreateForm(true);
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

  const totalListings = listings.length;
  const humanListings = listings.filter((l) => l.category === "HUMAN").length;
  const animalListings = listings.filter((l) => l.category === "ANIMAL").length;
  const totalRevenue = listings.reduce((sum, l) => sum + l.price, 0);
  const avgDiscount =
    listings.filter((l) => l.originalPrice).length > 0
      ? listings
          .filter((l) => l.originalPrice)
          .reduce(
            (sum, l) =>
              sum + ((l.originalPrice! - l.price) / l.originalPrice!) * 100,
            0,
          ) / listings.filter((l) => l.originalPrice).length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar user={user} logout={logout} />

      <div className="relative flex">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="hidden lg:block fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-r border-white/10 overflow-y-auto z-30"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Statistics</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                    aria-label="Close sidebar"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
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

                <div className="space-y-4">
                  <StatCard
                    label="Total Listings"
                    value={totalListings}
                    index={0}
                  />
                  <StatCard label="Human Food" value={humanListings} index={1}>
                    <p className="text-xs text-gray-400 mt-1">
                      {totalListings > 0
                        ? Math.round((humanListings / totalListings) * 100)
                        : 0}
                      % of total
                    </p>
                  </StatCard>
                  <StatCard
                    label="Animal Feed"
                    value={animalListings}
                    index={2}
                  >
                    <p className="text-xs text-gray-400 mt-1">
                      {totalListings > 0
                        ? Math.round((animalListings / totalListings) * 100)
                        : 0}
                      % of total
                    </p>
                  </StatCard>
                  <StatCard
                    label="Total Value"
                    value={`Rf ${totalRevenue.toFixed(2)}`}
                    index={3}
                  >
                    <p className="text-xs text-gray-400 mt-1">
                      Combined listing prices
                    </p>
                  </StatCard>
                  {avgDiscount > 0 && (
                    <StatCard
                      label="Avg. Discount"
                      value={`${avgDiscount.toFixed(1)}%`}
                      index={4}
                    >
                      <p className="text-xs text-gray-400 mt-1">
                        Average savings offered
                      </p>
                    </StatCard>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "ml-0"} w-full`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mt-20">
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

            <Modal
              isOpen={showCreateForm}
              onClose={resetForm}
              title={editingListing ? "Edit Listing" : "Create New Listing"}
            >
              <ListingForm
                formData={formData}
                isEditing={!!editingListing}
                isSubmitting={submitting}
                onSubmit={editingListing ? handleUpdate : handleCreate}
                onChange={handleInputChange}
                onImageUpload={handleImageUpload}
                onCategoryChange={handleCategoryChange}
                onCancel={resetForm}
              />
            </Modal>

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
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    index={index}
                    showActions
                    onEdit={startEdit}
                    onDelete={handleDelete}
                  />
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
