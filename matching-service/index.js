const express = require("express");
const cors = require("cors");
const app = express();
const matchingRoutes = require("./routes/matching-routes");

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", service: "matching-service" });
});

// Routes
app.use("/matching", matchingRoutes);

module.exports = app;
