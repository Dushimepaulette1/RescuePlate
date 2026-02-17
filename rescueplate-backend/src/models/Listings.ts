import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "HUMAN" | "ANIMAL";
  quantity: string;
  pickupTime: string;
  createdAt: Date;
}

const ListingSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for your food"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a discounted price"],
  },
  originalPrice: {
    type: Number,
  },
  category: {
    type: String,
    enum: ["HUMAN", "ANIMAL"],
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IListing>("Listing", ListingSchema);
