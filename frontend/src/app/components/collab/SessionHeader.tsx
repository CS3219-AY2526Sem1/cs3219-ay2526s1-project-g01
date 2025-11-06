"use client";
import { Button } from "@/components/ui/button";
import { CircleUser, Mic } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function SessionHeader({
  showConfirmationAlert,
}: {
  showConfirmationAlert: () => void;
}) {
  const { user } = useUser();

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
      <div>
        <Button className="mr-3">
          <Mic />
        </Button>
        <Button
          onClick={showConfirmationAlert}
          className="bg-red-500 text-black mr-3 hover:bg-red-300"
        >
          Leave Session
        </Button>
      </div>
    </header>
  );
}
