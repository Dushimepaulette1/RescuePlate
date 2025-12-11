const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json()); // Allows us to accept JSON data in the body
app.use(cors()); // Allows our React frontend to talk to this backend

const listingsRoutes = require("./routes/listings");
app.use("/api/listings", listingsRoutes);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
};

app.get("/", (req, res) => {
  res.send("RescuePlate API is Running!");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
