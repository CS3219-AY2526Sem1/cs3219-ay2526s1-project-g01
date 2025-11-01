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

export default function MatchPage() {
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [showRejoinRoomDialog, setshowRejoinRoomDialog] =
    useState<boolean>(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const {
    status,
    sessionId,
    timeRemaining,
    startMatching,
    handleCancelSearch,
    clearPolling,
    setStatus,
    setSessionId,
  } = useMatchingService(user?.id);

  const handleStartMatching = () => {
    startMatching(difficulty, topics, user?.username || user?.id || "");
  };

  //Handles every socket connection to server and closes the creating room dialog box
  useEffect(() => {
    if (status === "active" && sessionId) {
      const wsBaseUrl =
        process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost/collab-socket";
      const jwt = getToken() || "";
      // const wsUrl = `${wsBaseUrl}/?token=${encodeURIComponent(jwt)}&sessionId=${sessionId}`;
      const wsUrl = `${wsBaseUrl}/?token=${user?.id}&sessionId=${sessionId}`;
      const socket = editorWebSocketManager.connect(wsUrl);

      socket.onopen = () => {
        console.log("Socket connection established");
        setStatus("connected");
      };

      socket.onclose = () => {
        console.log("Socket connection closed");
        editorWebSocketManager.close();
      };
    }
    console.log("useeffect should run ");
  }, [status, sessionId, router]);

  //Handles navigation to collab page and closing of socket connection when user leaves a session willingly
  useEffect(() => {
    if (status === "connected" && sessionId) {
      router.push(`/collab?sessionId=${sessionId}`);
    } else if (status === "idle" && editorWebSocketManager.getSocket()) {
      editorWebSocketManager.close();
    }
  }, [status]);

  useEffect(() => {
    const rejoinRoom = async () => {
      try {
        console.log("call get endpoint to check if have session");
        const collabURL = process.env.NEXT_PUBLIC_COLLAB_URL;
        const response = await fetch(
          `${collabURL}/${encodeURIComponent(user?.id!)}`
        );
        const data = await response.json();
        if (data.hasSession) {
          console.log("user has session ongoing");
          setSessionId(data.sessionId);
          setshowRejoinRoomDialog(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user?.id) {
      console.log("rejoin room function runs");
      rejoinRoom();
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
    </div>
  );
}
