import express from "express";
import {
  getUserSessionStatus,
  deleteUserSession,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/:userId", getUserSessionStatus);
userRouter.delete("/:userId", deleteUserSession);
export default userRouter;
