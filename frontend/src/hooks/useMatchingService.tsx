import { useState, useRef, useCallback, useEffect } from "react";
import {
  startMatch,
  getMatchStatus,
  terminateMatch,
} from "@/services/matchingServiceApi";
import { toast } from "sonner";

export function useMatchingService(userId: string | undefined) {
  const [status, setStatus] = useState<"idle" | "searching" | "matched">(
    "idle",
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
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
            if (data.status === "matched") {
              clearPolling();
              setSessionId(data.sessionId!);
              setStatus("matched");
            } else if (data.status === "searching") {
              if (data.remainingTime !== undefined) {
                setTimeRemaining(Math.ceil(data.remainingTime / 1000));
              }
            } else if (data.status === "idle") {
              clearPolling();
              setStatus("idle");
              setErrorMessage(
                "No match found within 5 minutes. Please try again with different criteria.",
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
    [clearPolling],
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
        if (data.success && data.matchFound) {
          setSessionId(data.sessionId!);
          setStatus("matched");
        } else {
          pollStatus(userId);
        }
      } catch (err: unknown) {
        console.error("Error starting match:", err);
        const errorMsg =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "Failed to start matching.";
        setErrorMessage(errorMsg);
        setStatus("idle");
      }
    },
    [userId, pollStatus],
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
    startMatching,
    handleCancelSearch,
    clearPolling,
  };
}
