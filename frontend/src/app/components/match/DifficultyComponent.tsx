"use client";
import { IoIosSettings } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Difficulty } from "@/types/difficulty";

type DifficultyProps = {
  setDifficulty: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function DifficultyComponent({
  setDifficulty,
}: DifficultyProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);

  const handleDifficultySelect = (difficulty: string) => {
    const newSelection = selectedDifficulty.includes(difficulty)
      ? selectedDifficulty.filter((d) => d !== difficulty)
      : [...selectedDifficulty, difficulty];

    setSelectedDifficulty(newSelection);
    setDifficulty(newSelection);
  };

  return (
    <Card className="w-[80%] flex-1 m-10">
      <div className="flex w-full ">
        <IoIosSettings className="ml-3 mt-1 text-2xl" />
        <CardHeader className="ml-5 flex-1 ml-0 pl-3">
          <CardTitle className="text-2xl font-bold">Difficulty Level</CardTitle>
          <CardDescription>
            Select one or more difficulty levels that you would like to practice
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="flex flex-wrap justify-evenly h-full items-center gap-3">
        <Button
          onClick={() => handleDifficultySelect(Difficulty.EASY)}
          className={`flex-1 h-[50px] min-w-[150px] relative bg-green-200 text-black hover:bg-green-200/90 flex items-center justify-center`}
        >
          <span className="absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-64px)] truncate">
            {Difficulty.EASY}
          </span>
          <IoCheckmark
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-green-800 text-3xl flex-shrink-0 ${
              selectedDifficulty.includes(Difficulty.EASY)
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        </Button>
        <Button
          onClick={() => handleDifficultySelect(Difficulty.MEDIUM)}
          className={`flex-1 h-[50px] min-w-[150px] relative bg-yellow-200 text-black hover:bg-yellow-200/90 flex items-center justify-center`}
        >
          <span className="absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-64px)] truncate">
            {Difficulty.MEDIUM}
          </span>
          <IoCheckmark
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-yellow-800 text-3xl flex-shrink-0 ${
              selectedDifficulty.includes(Difficulty.MEDIUM)
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        </Button>
        <Button
          onClick={() => handleDifficultySelect(Difficulty.HARD)}
          className={`flex-1 h-[50px] min-w-[150px] relative bg-red-200 text-black hover:bg-red-200/90 flex items-center justify-center`}
        >
          <span className="absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-64px)] truncate">
            {Difficulty.HARD}
          </span>
          <IoCheckmark
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-red-800 text-3xl flex-shrink-0 ${
              selectedDifficulty.includes(Difficulty.HARD)
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        </Button>
      </CardContent>
    </Card>
  );
}
