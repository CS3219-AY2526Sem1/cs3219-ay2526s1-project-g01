import express from "express";
import sessionRouter from "./routes/session-routes.js";
import userRouter from "./routes/user-routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/sessions", sessionRouter);
app.use("/api", userRouter);
app.use((req, res, next) => {
  const error = new Error("Invalid route");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

export default app;
