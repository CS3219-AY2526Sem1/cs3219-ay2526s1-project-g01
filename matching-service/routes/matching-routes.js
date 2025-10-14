const express = require("express");
const router = express.Router();
const matchingController = require("../controller/matching-controller");

router.post("/match", matchingController.startMatch);

// Terminate matching (manual)
router.delete("/match/:userId", matchingController.terminateMatch);

// Check status
router.get("/status/:userId", matchingController.checkStatus);

// Get session details
router.get("/session/:sessionId", matchingController.getSession);

// End session (when user leaves collab)
router.delete("/session/:userId", matchingController.endSession);

// Get queue statistics (admin/monitoring)
// router.get("/stats", matchingController.getQueueStats);

module.exports = router;
