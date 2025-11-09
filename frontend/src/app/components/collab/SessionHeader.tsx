"use client";
import { Button } from "@/components/ui/button";
import { CircleUser, Mic, Check } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { editorWebSocketManager } from "@/services/editorSocketManager";
import { markQuestionAttempted } from "@/services/questionServiceApi";

export default function SessionHeader({
  showConfirmationAlert,
  questionId,
  sessionId,
  partnerUserId,
}: {
  showConfirmationAlert: () => void;
  questionId: number | null;
  sessionId: string | null;
  partnerUserId: string | null;
}) {
  const { user } = useUser();
  const [isMarkedAsCompleted, setIsMarkedAsCompleted] = useState(false);
  const [showMarkAttemptDialog, setShowMarkAttemptDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPartnerConnected, setIsPartnerConnected] = useState(true);

  useEffect(() => {
    const socket = editorWebSocketManager.getSocket();
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.type === "attempt-marked") {
          setIsMarkedAsCompleted(true);
        }

        // Track partner connection status
        if (data.type === "disconnect" && data.disconnectedUserId === partnerUserId) {
          setIsPartnerConnected(false);
          console.log("Partner disconnected:", data.disconnectedUserId);
        }
      } catch (error) {
        // Not a JSON message, ignore
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [partnerUserId]);

  const handleMarkAsAttempted = async () => {
    // Debug logging
    console.log("Debug - user?.id:", user?.id);
    console.log("Debug - questionId:", questionId);
    console.log("Debug - partnerUserId:", partnerUserId);
    console.log("Debug - isPartnerConnected:", isPartnerConnected);

    if (!user?.id || !questionId) {
      console.error("Missing required data for marking attempt", {
        userId: user?.id,
        questionId,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Only include users who are currently in the session
      const activeUserIds = [user.id];
      if (partnerUserId && isPartnerConnected) {
        activeUserIds.push(partnerUserId);
      }

      console.log("Marking attempt for active users:", activeUserIds);

      // Call the API to mark the question as attempted for active users only
      await markQuestionAttempted(questionId, activeUserIds, today);

      // Mark as completed locally
      setIsMarkedAsCompleted(true);

      // Broadcast to partner via WebSocket
      const socket = editorWebSocketManager.getSocket();
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "attempt-marked",
          }),
        );
      }

      setShowMarkAttemptDialog(false);
    } catch (error) {
      console.error("Error marking question as attempted:", error);
      alert("Failed to mark question as attempted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header
        className="flex
        justify-between
        items-center
        gap-3
        bg-stone-800
        w-full
        h-15
        text-white
        border-b-2
        border-stone-700"
      >
        <div className="flex justify-center items-center ml-5">
          <CircleUser className="text-white mr-2" size="25" />
          <div className="text-white mr-3">
            {user?.username || "Guest User"}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowMarkAttemptDialog(true)}
            disabled={isMarkedAsCompleted}
            className={
              isMarkedAsCompleted
                ? "bg-green-600 text-white cursor-not-allowed hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }
          >
            {isMarkedAsCompleted ? (
              <>
                <Check className="mr-2" size={18} />
                Marked as Completed
              </>
            ) : (
              "Mark as Attempted"
            )}
          </Button>
          <Button
            onClick={showConfirmationAlert}
            className="bg-red-500 text-black mr-3 hover:bg-red-300"
          >
            Leave Session
          </Button>
        </div>
      </header>

      <AlertDialog.Root
        open={showMarkAttemptDialog}
        onOpenChange={setShowMarkAttemptDialog}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content
            className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 
          rounded-2xl bg-white p-6 shadow-lg"
          >
            <AlertDialog.Title className="text-lg font-semibold text-gray-900">
              Mark Question as Attempted?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-gray-600">
              {isPartnerConnected 
                ? "This will mark this question as attempted for both you and your partner. This action cannot be undone."
                : "Your partner has left the session. This will mark this question as attempted for you only. This action cannot be undone."}
            </AlertDialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button
                  disabled={isSubmitting}
                  className="w-24 px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={handleMarkAsAttempted}
                  disabled={isSubmitting}
                  className="w-24 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "..." : "Confirm"}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
