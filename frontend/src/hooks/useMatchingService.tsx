/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-03
 * Purpose: To integrate question data retrieval and display in the collaboration page.
 * Author Review: Verified correctness and functionality of the code.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import {
  startMatch,
  getMatchStatus,
  terminateMatch,
  endSession,
  Question,
} from "@/services/matchingServiceApi";
import { toast } from "sonner";

export function useMatchingService(userId: string | undefined) {
  //matched status === found a partner
  //active status === room created in backend server
  //connected status === socket connection established and ready for navigation to collab page
  const [status, setStatus] = useState<
    "idle" | "searching" | "matched" | "active" | "connected"
  >("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { duration: 6000 });
    }
    setErrorMessage(null);
  }, [errorMessage]);

  const clearPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    (uid: string) => {
      pollingInterval.current = setInterval(async () => {
        try {
          const data = await getMatchStatus(uid);
          if (data.success) {
            console.log(data.status);

            if (data.status === "matched") {
              if (!sessionId) {
                setSessionId(data.sessionId!);
                setStatus("matched");
                console.log("frontend sets status to matched");
                setTimeRemaining(0);
              }
            } else if (data.status === "searching") {
              if (data.remainingTime !== undefined) {
                setTimeRemaining(Math.ceil(data.remainingTime / 1000));
              }
            } else if (data.status === "active") {
              setStatus("active");
              // Store the question data from the response
              if (data.question) {
                setQuestion(data.question);
                console.log("Question data received:", data.question);
              }
              console.log("frontend sets status to active");
              clearPolling();
              //Delete sessionData in matching service redis if both users already polled status active
              if (data.canDelete) {
                console.log("frontend calls endSession due to active");
                await endSession(uid);
              }
            } else if (data.status === "failed") {
              // Session creation failed (e.g., no questions available)
              clearPolling();

              // Show detailed error message
              const errorMsg =
                data.errorMessage ||
                "Failed to create session. Please try again later.";
              setErrorMessage(errorMsg);
              console.error("Session creation failed:", data.error);

              // Clean up the failed session for both users
              if (data.canDelete && uid) {
                // Clean up the failed session for this user
                try {
                  console.log("frontend calls endSession due to failed");

                  await endSession(uid);
                  console.log("Cleaned up failed session");
                } catch (cleanupErr) {
                  console.error(
                    "Error cleaning up failed session:",
                    cleanupErr
                  );
                }
              }

              // Reset state to idle after cleanup
              setStatus("idle");
              setSessionId(null);
              setTimeRemaining(null);
            } else if (data.status === "idle") {
              clearPolling();
              setStatus("idle");
              setErrorMessage(
                "No match found within 5 minutes. Please try again with different criteria."
              );
            }
          }
        } catch (err) {
          console.error("Error polling:", err);
          clearPolling();
          setStatus("idle");
          setErrorMessage("Connection error. Please try again.");
        }
      }, 1000);
    },

    [clearPolling, sessionId]
  );

  const startMatching = useCallback(
    async (difficulty: string[], topics: string[], username: string) => {
      if (!userId) {
        setErrorMessage("User not found, please log in.");
        return;
      }
      if (difficulty.length === 0 || topics.length === 0) {
        setErrorMessage("Please select at least one difficulty and one topic.");
        return;
      }

      setStatus("searching");
      setErrorMessage(null);

      try {
        const data = await startMatch({ userId, username, difficulty, topics });
        if (
          data.success &&
          data.matchFound &&
          data.matchData?.status == "matched"
        ) {
          setSessionId(data.sessionId!);
          setStatus("matched");
        }

        //Note that both users will poll matching service, user1 poll for matched and subsequently active status and user 2 for active status
        pollStatus(userId);
      } catch (err: unknown) {
        console.error("Error starting match:", err);
        const errorMsg =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "Failed to start matching.";
        setErrorMessage(errorMsg);
        setStatus("idle");
      }
    },
    [userId, pollStatus]
  );

  const handleCancelSearch = useCallback(async () => {
    if (!userId) return;
    try {
      await terminateMatch(userId);
      clearPolling();
      setStatus("idle");
      setTimeRemaining(null);
      setErrorMessage(null);
    } catch (err) {
      console.error("Error canceling:", err);
      setErrorMessage("Failed to cancel search.");
    }
  }, [userId, clearPolling]);

  return {
    status,
    sessionId,
    timeRemaining,
    question,
    startMatching,
    handleCancelSearch,
    clearPolling,
    setStatus,
    setSessionId,
  };
}
