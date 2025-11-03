const express = require("express");
const router = express.Router();
const matchingController = require("../controller/matching-controller");
const { verifyAccessToken } = require("../middleware/auth");

router.post("/match", verifyAccessToken, matchingController.startMatch);

// Terminate matching (manual)
router.delete("/match/:userId", verifyAccessToken, matchingController.terminateMatch);

// Check status
router.get("/status/:userId", verifyAccessToken, matchingController.checkStatus);

// Get session details
router.get("/session/:sessionId", verifyAccessToken, matchingController.getSession);

// End session (when user leaves collab)
router.delete("/session/:userId", verifyAccessToken, matchingController.endSession);

// Get queue statistics (admin/monitoring)
// router.get("/stats", matchingController.getQueueStats);

module.exports = router;
