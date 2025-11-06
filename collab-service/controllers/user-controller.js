import { userToRoom, roomToData } from "../webSocketServer.js";
import logger from "../utils/logger.js";

//Get sessionId and partner Id stored in local memory from userId
export function getUserSessionStatus(req, res) {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (userId !== req.user.id) {
    return res.status(403).json({
      hasSession: false,
      error: "Forbidden: Cannot check session for another user",
    });
  }

  if (!userToRoom.has(userId)) {
    return res.json({ hasSession: false });
  }
  const { sessionId, partner } = userToRoom.get(userId);

  if (!sessionId) {
    return res.json({ hasSession: false });
  }
  const sessionData = roomToData.get(sessionId);
  if (sessionData.users.has(partner)) {
    return res.json({ hasSession: true, sessionId });
  } else {
    return res.json({ hasSession: false });
  }
}

//Delete userId to sessionId and partner mapping in local memory
export function deleteUserSession(req, res) {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Cannot delete session for another user",
    });
  }
  if (!userToRoom.has(userId)) {
  } else {
    userToRoom.delete(userId);
    logger.info("useriD TO SESSIONID Mapping deleted");
  }
  return res.status(200).json({ sucess: true });
}
