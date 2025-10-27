"use client";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export default function SessionHeader({
  showConfirmationAlert,
}: {
  showConfirmationAlert: () => void;
}) {
  return (
    <header
      className="flex
        justify-end
        items-center
        gap-3
        bg-stone-800
        w-full
        h-15
        text-white
        border-b-2
        border-stone-700"
    >
      <Button>
        <Mic />
      </Button>
      <Button
        onClick={showConfirmationAlert}
        className="bg-red-500 text-black mr-3 hover:bg-red-300"
      >
        Leave Session
      </Button>
    </header>
  );
}
