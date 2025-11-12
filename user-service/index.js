/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-24
 * Purpose: To update the main application index to include verification routes for email verification functionality.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import express from "express";
import cors from "cors";

import userRoutes from "./routes/user-routes.js";
import authRoutes from "./routes/auth-routes.js";
import verificationRoutes from "./routes/verification-routes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// CORS configuration using config.json - whitelist frontend and API gateway only
const corsOptions = {
  origin: (origin, callback) => {
    // Build allowed origins from config
    const allowedOrigins = [
      process.env.FRONTEND_BASE_URL || "http://localhost:3000",
      process.env.API_GATEWAY_BASE_URL || "http://localhost"
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests) or from whitelisted origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Origin blocked by CORS: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// To handle CORS Errors
app.use((req, res, next) => {
  next();
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/verification", verificationRoutes);

app.get("/", (req, res, next) => {
  console.log("Sending Greetings!");
  res.json({
    message: "Hello World from user-service",
  });
});

// Handle When No Route Match Is Found
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
