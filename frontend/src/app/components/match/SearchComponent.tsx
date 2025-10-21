"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
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
          className="mb-15 w-[80%] bg-black text-white"
          variant="outline"
          onClick={onSearch}
          disabled={isMatched || isSearching}
        >
          Start Searching
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[30%] flex flex-col items-center"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="flex items-center">
          <DialogTitle>Searching for a match...</DialogTitle>
          <DialogDescription>Hold on tight!</DialogDescription>
        </DialogHeader>

        <Spinner variant="circle-filled" />

        {/* Countdown Timer */}
        <div className="w-full mt-4 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {formatTimeRemaining(timeRemaining)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Time remaining</p>

          {/* Progress Bar */}
          <div className="w-full mt-4 bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
              style={{
                width: `${timeRemaining ? (timeRemaining / 300) * 100 : 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Cancel Button */}
        <Button
          onClick={onCancel}
          variant="destructive"
          className="mt-6 w-full"
        >
          Cancel Search
        </Button>
      </DialogContent>
    </Dialog>
  );
}
