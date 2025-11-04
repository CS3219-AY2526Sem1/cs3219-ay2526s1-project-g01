"use client";
import { Button } from "@/components/ui/button";
import { CircleUser, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { endSession } from "@/services/matchingServiceApi";
import { useUser } from "@/contexts/UserContext";

export default function SessionHeader() {
  const router = useRouter();
  const { user } = useUser();

  async function directToMatch() {
    if (user?.id) {
      try {
        await endSession(user.id);
      } catch (error) {
        console.error("Failed to end session:", error);
      }
    }
    router.replace("/match");
  }

  return (
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
        <div className="text-white mr-3">{user?.username || "Guest User"}</div>
      </div>
      <Button
        onClick={() => directToMatch()}
        className="bg-red-500 text-black mr-3 hover:bg-red-300"
      >
        Leave Session
      </Button>
    </header>
  );
}
