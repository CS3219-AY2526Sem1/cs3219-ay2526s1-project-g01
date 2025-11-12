/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-10-21
 * Purpose: To add routes for updating user password and username separately with proper authentication.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
  updateUserPassword,
  updateUsername,
} from "../controller/user-controller.js";
import {
  verifyAccessToken,
  verifyIsAdmin,
  verifyIsOwnerOrAdmin,
} from "../middleware/basic-access-control.js";

const router = express.Router();

router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch(
  "/:id/privilege",
  verifyAccessToken,
  verifyIsAdmin,
  updateUserPrivilege,
);

router.post("/", createUser);

router.get("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

router.patch("/:id/password", verifyAccessToken, verifyIsOwnerOrAdmin, updateUserPassword);

router.patch("/:id/username", verifyAccessToken, verifyIsOwnerOrAdmin, updateUsername);

router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

export default router;
