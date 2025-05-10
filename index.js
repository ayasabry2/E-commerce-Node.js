const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const AppError = require("./utils/AppError");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(404, "Route not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(err.statusCode || 500).json({
    status: 'fail',
    message: err.message || 'Please try again later!'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
