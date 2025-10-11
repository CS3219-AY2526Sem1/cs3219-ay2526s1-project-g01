const matchingService = require("../services/matching-service");

exports.startMatch = async (req, res) => {
  try {
    const { userId, username, difficulty, topics } = req.body;

    if (!userId || !difficulty || !topics) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, difficulty, topics",
      });
    }

    const result = await matchingService.enqueueUser({
      userId,
      username: username || userId,
      difficulty,
      topics,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("[CONTROLLER ERROR] startMatch:", err);

    if (err.message === "User is already in a matching queue") {
      return res.status(409).json({
        success: false,
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.terminateMatch = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    const result = await matchingService.terminateUser(userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("[CONTROLLER ERROR] terminateMatch:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    const status = await matchingService.checkStatus(userId);

    res.status(200).json({
      success: true,
      ...status,
    });
  } catch (err) {
    console.error("[CONTROLLER ERROR] checkStatus:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Missing sessionId parameter",
      });
    }

    const session = await matchingService.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (err) {
    console.error("[CONTROLLER ERROR] getSession:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter",
      });
    }

    const result = await matchingService.endSession(userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("[CONTROLLER ERROR] endSession:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// exports.getQueueStats = async (req, res) => {
//   try {
//     const stats = await matchingService.getQueueStats();

//     res.status(200).json({
//       success: true,
//       data: stats
//     });

//   } catch (err) {
//     console.error("[CONTROLLER ERROR] getQueueStats:", err);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error"
//     });
//   }
// };
