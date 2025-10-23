import express from "express";
import { createSession } from "../controllers/session-controller.js";

const sessionRouter = express.Router();

sessionRouter.post("", createSession);

sessionRouter.get("", (req, res) => {
  res.status(200).json({ message: "test1" });
});

export default sessionRouter;
