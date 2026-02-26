import { motion } from "framer-motion";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  category: "HUMAN" | "ANIMAL";
  quantity: string;
  pickupTime: string;
  image: string;
  phoneNumber: string;
}

interface ListingFormProps {
  formData: ListingFormData;
  isEditing: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: "HUMAN" | "ANIMAL") => void;
  onCancel: () => void;
}

const ListingForm = ({
  formData,
  isEditing,
  isSubmitting,
  onSubmit,
  onChange,
  onImageUpload,
  onCategoryChange,
  onCancel,
}: ListingFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="title"
          label="Title"
          value={formData.title}
          onChange={onChange}
          placeholder="e.g., 5 Large Pizzas"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onCategoryChange("HUMAN")}
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
              onClick={() => onCategoryChange("ANIMAL")}
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

      <TextArea
        name="description"
        label="Description"
        value={formData.description}
        onChange={onChange}
        placeholder="Describe your food..."
        rows={3}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          name="price"
          label="Price (Rf)"
          value={formData.price}
          onChange={onChange}
          placeholder="5000"
          step={1}
          required
        />
        <Input
          type="number"
          name="originalPrice"
          label="Original Price (Rf) - Optional"
          value={formData.originalPrice}
          onChange={onChange}
          placeholder="8000"
          step={1}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="quantity"
          label="Quantity"
          value={formData.quantity}
          onChange={onChange}
          placeholder="5 boxes"
          required
        />
        <Input
          name="pickupTime"
          label="Pickup Time"
          value={formData.pickupTime}
          onChange={onChange}
          placeholder="Today 5:00 PM - 6:00 PM"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Food Image *{" "}
            {!isEditing && <span className="text-primary">(Required)</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
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

        <Input
          type="tel"
          name="phoneNumber"
          label="Contact Phone Number"
          value={formData.phoneNumber}
          onChange={onChange}
          placeholder="+1 (234) 567-8900"
          labelClassName="mb-2"
          className="mb-1"
        />
        <p className="text-xs text-gray-400 -mt-2">
          For customers to contact you for pickup
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          className={`flex-1 ${
            isSubmitting ? "opacity-50 blur-[1px] cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? isEditing
              ? "Updating listing..."
              : "Creating listing..."
            : isEditing
              ? "Update Listing"
              : "Create Listing"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ListingForm;
