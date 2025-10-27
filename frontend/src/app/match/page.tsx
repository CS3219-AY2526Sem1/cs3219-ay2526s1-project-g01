"use client";
import { useState, useEffect } from "react";
import TopicsComponent from "../components/match/TopicsComponent";
import DifficultyComponent from "../components/match/DifficultyComponent";
import SearchComponent from "../components/match/SearchComponent";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useMatchingService } from "@/hooks/useMatchingService";

export default function MatchPage() {
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const { user } = useUser();
  const router = useRouter();

  const {
    status,
    sessionId,
    timeRemaining,
    errorMessage,
    startMatching,
    handleCancelSearch,
    clearPolling,
  } = useMatchingService(user?.id);

  const handleStartMatching = () => {
    startMatching(difficulty, topics, user?.username || user?.id || "");
  };

  useEffect(() => {
    if (status === "matched" && sessionId) {
      router.push(`/collab?sessionId=${sessionId}`);
    }
  }, [status, sessionId, router]);

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
        isMatched={status === "matched"}
        onCancel={handleCancelSearch}
        timeRemaining={timeRemaining}
        isSearching={status === "searching"}
      />
    </div>
  );
}
