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
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// To handle CORS Errors
app.use((req, res, next) => {
  // debugging statements uncomment when error occurs
  // console.log(`=== INCOMING REQUEST ===`);
  // console.log(`Method: ${req.method}`);
  // console.log(`URL: ${req.url}`);
  // console.log(`Path: ${req.path}`);
  // console.log(`Headers:`, req.headers);
  // console.log(`========================`);
  
  res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/verification", verificationRoutes);

// Debug: Log all registered routes (uncomment when error occurs)
// app._router.stack.forEach(function(r){
//   if(r.route && r.route.path){
//     console.log('Route:', r.route.path, Object.keys(r.route.methods));
//   } else if(r.name === 'router'){
//     r.handle.stack.forEach(function(nestedR){
//       if(nestedR.route){
//         console.log('Nested Route:', r.regexp.source.replace('\\/?(?=\\/|$)',''), nestedR.route.path, Object.keys(nestedR.route.methods));
//       }
//     });
//   }
// });

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
