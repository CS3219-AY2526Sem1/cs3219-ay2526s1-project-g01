import express from "express";
import {
  getUserSessionStatus,
  deleteUserSession,
} from "../controllers/user-controller.js";
import { verifyAccessToken } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.get("/:userId", verifyAccessToken, getUserSessionStatus);
userRouter.delete("/:userId", verifyAccessToken, deleteUserSession);
export default userRouter;
