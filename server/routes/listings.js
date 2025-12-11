const express = require("express");
const router = express.Router();
const Listing = require("../models/Listings");
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      OriginalPrice,
      quantity,
      pickupTime,
    } = req.body;
    const newListing = new Listing({
      title,
      description,
      category,
      price,
      OriginalPrice,
      quantity,
      pickupTime,
    });
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
module.exports = router;
