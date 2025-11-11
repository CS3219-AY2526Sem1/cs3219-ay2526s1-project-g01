/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-03
 * Purpose: To integrate question data retrieval and display in the collaboration page.
 * Author Review: Verified correctness and functionality of the code.
 */

require("dotenv").config();

const redisClient = require("../utils/redisClient");
const { v4: uuidv4 } = require("uuid");

class MatchingService {
  constructor() {
    this.MATCH_TIMEOUT = 5 * 60 * 1000; // 5 mins in ms
    this.QUEUE_PREFIX = "match_queue:";
    this.USER_SESSION_PREFIX = "user_session:";
    this.ACTIVE_SEARCH_PREFIX = "active_search:";
    this.SESSION_PREFIX = "session:";
    this.timeouts = new Map(); // store timeout references
  }

  // use a single global queue for all matching requests (subset matching)
  generateQueueKey(difficulty, topics) {
    return `${this.QUEUE_PREFIX}global`;
  }

  // start matching process
  async enqueueUser({ userId, username, difficulty, topics }) {
    try {
      // check if user is already searching
      const existingSearch = await redisClient.get(
        `${this.ACTIVE_SEARCH_PREFIX}${userId}`
      );
      if (existingSearch) {
        throw new Error("User is already in a matching queue");
      }

      const queueKey = this.generateQueueKey(difficulty, topics);

      console.log(`[MATCHING] User ${userId} searching in queue: ${queueKey}`);

      // try to find a match immediately
      const match = await this.findMatch(
        { userId, username, difficulty, topics },
        queueKey
      );

      if (match) {
        return {
          matchFound: true,
          sessionId: match.sessionId,
          matchData: match,
        };
      }

      // no match found, add to queue
      const userQueueData = {
        userId,
        username: username || userId,
        difficulty,
        topics,
        joinedAt: Date.now(),
      };

      await redisClient.lPush(queueKey, JSON.stringify(userQueueData));

      // store active search with criteria and expiration time (in s) - deletes key after timeout
      await redisClient.setEx(
        `${this.ACTIVE_SEARCH_PREFIX}${userId}`,
        this.MATCH_TIMEOUT / 1000,
        JSON.stringify({ queueKey, ...userQueueData })
      );

      // schedule auto-termination - deletes from queue after timeout
      this.scheduleTimeout(userId, queueKey, userQueueData);

      console.log(`[MATCHING] User ${userId} added to queue, waiting...`);

      return {
        matchFound: false,
        message: "Searching for a match...",
        queueKey,
      };
    } catch (error) {
      console.error("[MATCHING ERROR] enqueueUser:", error);
      throw error;
    }
  }

  // find match in queue
  async findMatch(newUser, queueKey) {
    try {
      const waitingUsers = await redisClient.lRange(queueKey, 0, -1);

      for (const waitingUserData of waitingUsers) {
        const waitingUser = JSON.parse(waitingUserData);

        if (waitingUser.userId === newUser.userId) continue;

        // check if there's any overlap in difficulty preferences (subset matching)
        const difficultyMatch = this.hasIntersection(
          waitingUser.difficulty,
          newUser.difficulty
        );

        // check if there's any overlap in topics (subset matching)
        const topicsMatch = this.hasIntersection(
          waitingUser.topics,
          newUser.topics
        );

        if (difficultyMatch && topicsMatch) {
          // remove from queue
          await redisClient.lRem(queueKey, 1, waitingUserData);

          // find the intersection of preferences for the match criteria
          const matchedDifficulty = this.getIntersection(
            waitingUser.difficulty,
            newUser.difficulty
          );
          const matchedTopics = this.getIntersection(
            waitingUser.topics,
            newUser.topics
          );

          // create session
          const sessionId = uuidv4();
          const matchData = {
            sessionId,
            user1: {
              userId: waitingUser.userId,
              username: waitingUser.username,
            },
            user2: {
              userId: newUser.userId,
              username: newUser.username,
            },
            criteria: {
              difficulty: matchedDifficulty,
              topics: matchedTopics,
            },
            matchedAt: new Date().toISOString(),
            status: "matched",
            polled_users: [],
          };

          // store session (1 hour expiry - change in future iteration if necessary)
          await redisClient.setEx(
            `${this.SESSION_PREFIX}${sessionId}`,
            3600,
            JSON.stringify(matchData)
          );

          // map users to session
          await redisClient.setEx(
            `${this.USER_SESSION_PREFIX}${waitingUser.userId}`,
            3600,
            sessionId
          );
          await redisClient.setEx(
            `${this.USER_SESSION_PREFIX}${newUser.userId}`,
            3600,
            sessionId
          );

          // clean up active searches
          await redisClient.del(
            `${this.ACTIVE_SEARCH_PREFIX}${waitingUser.userId}`
          );
          await redisClient.del(
            `${this.ACTIVE_SEARCH_PREFIX}${newUser.userId}`
          );

          // cancel timeouts
          this.cancelTimeout(waitingUser.userId);
          this.cancelTimeout(newUser.userId);

          console.log(
            `[MATCH FOUND] ${waitingUser.userId} ↔ ${newUser.userId} | Session: ${sessionId}`
          );

          // Second user will call collab service endpoint to create a room, function runs in the background so there
          // wont be delay in returning a response to user2's matching request
          this.triggerRoomCreation(matchData);
          return matchData;
        }
      }

      return null;
    } catch (error) {
      console.error("[MATCHING ERROR] findMatch:", error);
      throw error;
    }
  }

  scheduleTimeout(userId, queueKey, userQueueData) {
    const timeoutId = setTimeout(async () => {
      try {
        const activeSearch = await redisClient.get(
          `${this.ACTIVE_SEARCH_PREFIX}${userId}`
        );

        if (activeSearch) {
          console.log(
            `[TIMEOUT] Auto-terminating user ${userId} after 5 minutes`
          );
          await this.terminateUser(userId);
        }
      } catch (error) {
        console.error("[TIMEOUT ERROR]:", error);
      } finally {
        this.timeouts.delete(userId);
      }
    }, this.MATCH_TIMEOUT);

    this.timeouts.set(userId, timeoutId);
  }

  // stop 5min timer from firing
  cancelTimeout(userId) {
    const timeoutId = this.timeouts.get(userId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(userId);
    }
  }

  async terminateUser(userId) {
    try {
      const activeSearchData = await redisClient.get(
        `${this.ACTIVE_SEARCH_PREFIX}${userId}`
      );

      if (!activeSearchData) {
        return { terminated: false, message: "No active search found" };
      }

      const activeSearch = JSON.parse(activeSearchData);
      const queueKey = activeSearch.queueKey;

      // remove from queue
      const userQueueData = JSON.stringify({
        userId,
        username: activeSearch.username,
        difficulty: activeSearch.difficulty,
        topics: activeSearch.topics,
        joinedAt: activeSearch.joinedAt,
      });

      await redisClient.lRem(queueKey, 1, userQueueData);
      await redisClient.del(`${this.ACTIVE_SEARCH_PREFIX}${userId}`);

      this.cancelTimeout(userId);

      console.log(`[TERMINATED] User ${userId} removed from queue`);

      return {
        terminated: true,
        message: "Matching terminated successfully",
      };
    } catch (error) {
      console.error("[TERMINATE ERROR]:", error);
      throw error;
    }
  }

  async checkStatus(userId) {
    try {
      // check if user has a session (matched)
      const sessionId = await redisClient.get(
        `${this.USER_SESSION_PREFIX}${userId}`
      );
      if (sessionId) {
        const matchData = await this.getSession(sessionId);
        let response = {
          status: matchData.status,
          sessionId,
        };

        if (matchData.status === "active" || matchData.status === "failed") {
          if (!matchData.polled_users.includes(userId)) {
            matchData.polled_users.push(userId);
            await redisClient.setEx(
              `${this.SESSION_PREFIX}${matchData.sessionId}`,
              3600,
              JSON.stringify(matchData)
            );
          }

          if (matchData.status === "active") {
            response = {
              question: matchData.question,
              canDelete: matchData.polled_users.length === 2,
              ...response,
            };
          } else if (matchData.status === "failed") {
            // Session creation failed, return error but keep session temporarily
            // so both users can see the error before it's cleaned up
            response = {
              status: "failed",
              canDelete: matchData.polled_users.length === 2,

              error: matchData.error,
              errorMessage: matchData.errorMessage,
              errorDetails: matchData.errorDetails,
            };
          }
        }
        return response;
      }
      // check if user is searching
      const activeSearch = await redisClient.get(
        `${this.ACTIVE_SEARCH_PREFIX}${userId}`
      );

      if (activeSearch) {
        const searchData = JSON.parse(activeSearch);
        const elapsedTime = Date.now() - searchData.joinedAt;
        const remainingTime = Math.max(0, this.MATCH_TIMEOUT - elapsedTime);

        return {
          status: "searching",
          elapsedTime,
          remainingTime,
          criteria: {
            difficulty: searchData.difficulty,
            topics: searchData.topics,
          },
        };
      }

      return {
        status: "idle",
      };
    } catch (error) {
      console.error("[STATUS ERROR]:", error);
      throw error;
    }
  }

  async getSession(sessionId) {
    try {
      const sessionData = await redisClient.get(
        `${this.SESSION_PREFIX}${sessionId}`
      );
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error("[GET SESSION ERROR]:", error);
      throw error;
    }
  }

  async endSession(userId) {
    try {
      console.log("IS endSESSION CALLED");
      const sessionId = await redisClient.get(
        `${this.USER_SESSION_PREFIX}${userId}`
      );

      if (!sessionId) {
        return { ended: false, message: "No active session found" };
      }
      const sessionData = await redisClient.get(
        `${this.SESSION_PREFIX}${sessionId}`
      );
      if (sessionData) {
        const session = JSON.parse(sessionData);

        await redisClient.del(`${this.SESSION_PREFIX}${sessionId}`);
        await redisClient.del(
          `${this.USER_SESSION_PREFIX}${session.user1.userId}`
        );
        await redisClient.del(
          `${this.USER_SESSION_PREFIX}${session.user2.userId}`
        );

        console.log(
          `[SESSION in redis deleted] ${sessionId} - Both users removed`
        );
      }

      return {
        ended: true,
        message: "Session ended successfully",
      };
    } catch (error) {
      console.error("[END SESSION ERROR]:", error);
      throw error;
    }
  }

  //create a session in collab service
  async triggerRoomCreation(matchData) {
    try {
      const response = await fetch(
        `${process.env.COLLAB_SERVICE_URL}/api/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: matchData.sessionId,
            user1: matchData.user1,
            user2: matchData.user2,
            criteria: matchData.criteria,
          }),
        }
      );

      if (response.ok) {
        // update Redis match data status to "active"
        const data = await response.json();
        const updatedMatch = {
          ...matchData,
          status: "active",
          question: data.question,
        };
        await redisClient.setEx(
          `${this.SESSION_PREFIX}${matchData.sessionId}`,
          3600,
          JSON.stringify(updatedMatch)
        );
        console.log("Created room successfully");
      } else {
        throw new Error(`Collab service returned ${response.status}`);
      }
    } catch (err) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {
          error: "Unknown error",
          message:
            "Failed to create session. We are currently facing issues with our server.",
        };
      }
      const errorMatch = {
        ...matchData,
        status: "failed",
        error:
          errorData.error ||
          "Failed to create session. We are currently facing issues with our server",
        errorMessage:
          errorData.message ||
          "Unable to create a collaboration session. Please try different criteria.",
        errorDetails: errorData.criteria || null,
      };

      try {
        await redisClient.setEx(
          `${this.SESSION_PREFIX}${matchData.sessionId}`,
          3600,
          JSON.stringify(errorMatch)
        );
        console.error(`Failed to create room for ${errorMatch.sessionId}`);
      } catch (redisErr) {
        console.error("Failed to store session state in Redis", redisErr);
      }
    }
  }

  // helper method to find intersection between two arrays
  getIntersection(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
    return arr1.filter(item => arr2.includes(item));
  }

  // check if two arrays have any common elements (subset match)
  hasIntersection(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    return arr1.some(item => arr2.includes(item));
  }

  // for future iteration if necessary - get stats of all queues
  // async getQueueStats() {
  //   try {
  //     const keys = await redisClient.keys(`${this.QUEUE_PREFIX}*`);
  //     const stats = [];

  //     for (const key of keys) {
  //       const count = await redisClient.lLen(key);
  //       if (count > 0) {
  //         stats.push({
  //           queueKey: key.replace(this.QUEUE_PREFIX, ""),
  //           waitingUsers: count
  //         });
  //       }
  //     }

  //     return stats;
  //   } catch (error) {
  //     console.error("[STATS ERROR]:", error);
  //     throw error;
  //   }
  // }
}

module.exports = new MatchingService();
