import { userToRoom, roomToData } from "../webSocketServer.js";
import logger from "../utils/logger.js";

export function getUserSessionStatus(req, res) {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }
  if (!userToRoom.has(userId)) {
    logger.info("part1");
    return res.json({ hasSession: false });
  }
  const { sessionId, partner } = userToRoom.get(userId);

  if (!sessionId) {
    logger.info("part2 ");

    return res.json({ hasSession: false });
  }
  const sessionData = roomToData.get(sessionId);
  if (sessionData.users.has(partner)) {
    logger.info("part3 ");
    return res.json({ hasSession: true, sessionId });
  } else {
    logger.info("part4");

    return res.json({ hasSession: false });
  }
}

export function deleteUserSession(req, res) {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }
  if (!userToRoom.has(userId)) {
  } else {
    userToRoom.delete(userId);
    logger.info("useriD TO SESSIONID Mapping deleted");
  }
  return res.status(200).json({ sucess: true });
}
