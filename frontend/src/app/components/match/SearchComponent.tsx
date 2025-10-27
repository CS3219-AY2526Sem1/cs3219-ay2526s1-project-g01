"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SearchComponentProps {
  onSearch: () => void;
  isMatched: boolean;
  onCancel: () => void;
  timeRemaining: number | null;
  isSearching: boolean;
}

export default function SearchComponent({
  onSearch,
  isMatched,
  onCancel,
  timeRemaining,
  isSearching,
}: SearchComponentProps) {
  const formatTimeRemaining = (seconds: number | null) => {
    if (seconds === null) return "5:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isSearching}>
      <DialogTrigger asChild>
        <Button
          className="
            mb-15 
            w-[40%] 
            bg-black 
            text-white
            rounded-xl 
            border-2
            border-stone-400
            hover:bg-stone-900
            hover:text-white"
          variant="outline"
          onClick={onSearch}
          disabled={isMatched || isSearching}
        >
          Start Searching
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
          w-[40%] 
          flex 
          flex-col 
          items-center 
          bg-stone-800 
          rounded-2xl 
          border-black"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <div className="absolute top-3 right-3">
          <Button className="bg-transparent" size="sm" onClick={onCancel}>
            <X />
          </Button>
        </div>
        <DialogHeader className="flex items-center text-white w-full">
          <DialogTitle>Searching for a match...</DialogTitle>
          <DialogDescription>Hold on tight!</DialogDescription>
        </DialogHeader>

        <Spinner variant="circle-filled" className="text-white" />

        {/* Countdown Timer */}
        <div className="w-full mt-4 text-center">
          <p className="text-2xl font-bold text-white">
            {formatTimeRemaining(timeRemaining)}
          </p>
          <p className="text-sm text-white mt-1">Time remaining</p>

          {/* Progress Bar */}
          <div className="w-full mt-4 bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-400 h-3 rounded-full transition-all duration-1000"
              style={{
                width: `${timeRemaining ? (timeRemaining / 300) * 100 : 100}%`,
              }}
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
