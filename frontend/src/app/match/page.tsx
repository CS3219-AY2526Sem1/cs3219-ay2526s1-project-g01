"use client";
import { useState, useEffect } from "react";
import TopicsComponent from "../components/match/TopicsComponent";
import DifficultyComponent from "../components/match/DifficultyComponent";
import SearchComponent from "../components/match/SearchComponent";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useMatchingService } from "@/hooks/useMatchingService";
import { editorWebSocketManager } from "@/services/editorSocketManager";
import { getToken } from "@/services/userServiceCookies";
import DisconnectAlertDialog from "@/components/ui/alert-dialog";
import { getUserSessionStatus } from "@/services/collabServiceApi";
import NotAuthorizedDialog from "@/components/ui/not-authorised-dialog";
import { useConnectionContext } from "@/contexts/ConnectionContext";

export default function MatchPage() {
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [showRejoinRoomDialog, setshowRejoinRoomDialog] =
    useState<boolean>(false);
  const [showConnectionErrorDialog, setShowConnectionErrorDialog] =
    useState<boolean>(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const wsBaseUrl =
    process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost/collab-socket";

  const {
    status,
    sessionId,
    timeRemaining,
    question,
    startMatching,
    handleCancelSearch,
    clearPolling,
    setStatus,
    setSessionId,
  } = useMatchingService(user?.id);

  const handleStartMatching = () => {
    startMatching(difficulty, topics, user?.username || user?.id || "");
  };
  const { setIsConnected } = useConnectionContext();

  //Handles every socket connection to server and closes the creating room dialog box
  useEffect(() => {
    if (status === "active" && sessionId) {
      const jwt = getToken() || "";
      const wsUrl = `${wsBaseUrl}/?token=${encodeURIComponent(jwt)}&sessionId=${sessionId}`;
      const socket = editorWebSocketManager.connect(wsUrl);

      socket.onopen = () => {
        console.log("Socket connection established");
        setStatus("connected");
        setIsConnected(true);
      };

      socket.onclose = () => {
        console.log("Socket connection closed");
        if (status === "active") {
          setShowConnectionErrorDialog(true);
          setStatus("idle");
        }
        editorWebSocketManager.close();
      };
    }
  }, [status, sessionId, router]);

  //Handles navigation to collab page and closing of socket connection when user leaves a session willingly
  useEffect(() => {
    if (status === "connected" && sessionId) {
      // Store question data in sessionStorage for collab page
      if (question) {
        sessionStorage.setItem(
          `question_${sessionId}`,
          JSON.stringify(question),
        );
      }
      router.push(`/collab?sessionId=${sessionId}`);
    } else if (status === "idle" && editorWebSocketManager.getSocket()) {
      editorWebSocketManager.close();
    }
  }, [status, question, sessionId, router]);

  //Determines if user left an existing session accidentally and provide option to rejoin
  useEffect(() => {
    if (user?.id) {
      getUserSessionStatus(
        user.id,
        (sid) => setSessionId(sid),
        () => setshowRejoinRoomDialog(true),
      );
    }
  }, [user?.id]);

  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  return (
    <div
      className="
        min-h-[calc(100vh-65px)] 
        flex flex-col 
        items-center justify-center 
        px-4 py-20
        bg-radial-[at_85%_85%] from-zinc-400 to-black to-85%"
    >
      <div className="text-center mb-8 w-full max-w-4xl px-4">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 break-words">
          Find your coding partner
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg break-words">
          Set your preferences and we will find the best match for you!
        </p>
      </div>

      <DifficultyComponent setDifficulty={setDifficulty} />
      <TopicsComponent setTopics={setTopics} />
      <SearchComponent
        onSearch={handleStartMatching}
        isMatched={status === "matched" || status === "active"}
        onCancel={handleCancelSearch}
        timeRemaining={timeRemaining}
        isSearching={status === "searching"}
      />
      <DisconnectAlertDialog
        open={showRejoinRoomDialog}
        onAccept={() => {
          setStatus("active");
          setshowRejoinRoomDialog(false);
        }}
        onReject={() => {
          setStatus("idle");
          setSessionId(null);
          setshowRejoinRoomDialog(false);
        }}
        buttonOneTitle={"Yes"}
        buttonTwoTitle={"No"}
        title={"You left an ongoing session"}
        description={"Do you want to join back the session?"}
      />
      <NotAuthorizedDialog
        open={showConnectionErrorDialog}
        onClose={() => setShowConnectionErrorDialog(false)}
        title={"Unauthorized Access"}
        description={"You don’t have permission to join this room."}
        buttonName={"Back"}
        showButton={true}
      />
    </div>
  );
}
