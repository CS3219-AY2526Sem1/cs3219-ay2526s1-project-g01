import express from "express";
import { createSession, getSessionDetails } from "../controllers/session-controller.js";

const sessionRouter = express.Router();

sessionRouter.post("", createSession);

sessionRouter.get("/:sessionId", getSessionDetails);

sessionRouter.get("", (req, res) => {
  res.status(200).json({ message: "test1" });
});

export default sessionRouter;
