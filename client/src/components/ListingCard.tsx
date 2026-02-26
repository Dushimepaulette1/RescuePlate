import { motion } from "framer-motion";
import { formatPrice, calculateDiscount } from "../utils/formatters";
import CategoryBadge from "./CategoryBadge";

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

interface ListingCardProps {
  listing: Listing;
  index: number;
  onAction?: (id: string) => void;
  actionLabel?: string;
  actionDisabled?: boolean;
  showVendorInfo?: boolean;
  showActions?: boolean;
  onEdit?: (listing: Listing) => void;
  onDelete?: (id: string) => void;
}

const ListingCard = ({
  listing,
  index,
  onAction,
  actionLabel = "Mark as Picked Up",
  actionDisabled = false,
  showVendorInfo = false,
  showActions = false,
  onEdit,
  onDelete,
}: ListingCardProps) => {
  const discount = listing.originalPrice
    ? calculateDiscount(listing.originalPrice, listing.price)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
    >
      {listing.image && (
        <div className="relative h-48 w-full">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <CategoryBadge category={listing.category} />
          </div>
          {listing.pickedUp && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">PICKED UP</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">
              {listing.title}
            </h3>
            {showVendorInfo && listing.vendorId && (
              <p className="text-sm text-gray-400">
                Posted by:{" "}
                <span className="text-primary font-semibold">
                  {listing.vendorId.name}
                </span>
              </p>
            )}
          </div>
        </div>

        <p className="text-gray-300 mb-4 text-sm sm:text-base break-words line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {formatPrice(listing.price)}
          </span>
          {listing.originalPrice && (
            <>
              <span className="text-gray-500 line-through">
                {formatPrice(listing.originalPrice)}
              </span>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="text-gray-400 break-words">
            <span className="font-semibold text-white">Quantity:</span>{" "}
            {listing.quantity}
          </div>
          <div className="text-gray-400 break-words">
            <span className="font-semibold text-white">Pickup:</span>{" "}
            {listing.pickupTime}
          </div>
          {(listing.phoneNumber ||
            (listing.vendorId && listing.vendorId.phoneNumber)) && (
            <div className="text-gray-400 break-words">
              <span className="font-semibold text-white">Contact:</span>{" "}
              <a
                href={`tel:${listing.phoneNumber || listing.vendorId?.phoneNumber}`}
                className="text-primary hover:text-secondary transition"
              >
                {listing.phoneNumber || listing.vendorId?.phoneNumber}
              </a>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEdit && onEdit(listing)}
              className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm sm:text-base"
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDelete && onDelete(listing._id)}
              className="flex-1 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm sm:text-base"
            >
              Delete
            </motion.button>
          </div>
        )}

        {onAction && (
          <motion.button
            whileHover={{ scale: actionDisabled ? 1 : 1.02 }}
            whileTap={{ scale: actionDisabled ? 1 : 0.98 }}
            onClick={() => onAction(listing._id)}
            disabled={actionDisabled}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              actionDisabled
                ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/50"
            }`}
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ListingCard;
