const mongoose = require("mongoose");
const { type } = require("os");
const ListingSchema = new mangoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  category: {
    type: String,
    enum: ["HUMAN", "ANIMAL"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  OriginalPrice: {
    type: Number,
  },
  quantity: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "RESERVED", "SOLD", "EXPIRED"],
    default: "AVAILABLE",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Listing", ListingSchema);
