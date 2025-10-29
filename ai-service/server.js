/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2024-10-28
 * Purpose: Complete implementation of AI assistant microservice for code explanation feature
 * Author Review: Architecture validated, error handling reviewed, and integration tested
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 8086;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/ai", aiRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "AI Service is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});

module.exports = app;
