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
import { ALL_TOPICS } from "@/types/topics";

type TopicsProps = {
  setTopics: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TopicsComponent({ setTopics }: TopicsProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicSelect = (topic: string) => {
    const newSelection = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];

    setSelectedTopics(newSelection);
    setTopics(newSelection);
  };

  return (
    <Card className="w-[80%] flex-1 m-10">
      <div className="flex w-full">
        <IoIosSettings className="ml-3 mt-1 text-2xl" />
        <CardHeader className="ml-5 flex-1 ml-0 pl-3">
          <CardTitle className="text-2xl font-bold">Topics</CardTitle>
          <CardDescription>
            Select one or more topics that you would like to practice
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="flex flex-wrap justify-evenly h-full items-center gap-3">
        {ALL_TOPICS.map((topic) => (
          <Button
            key={topic}
            onClick={() => handleTopicSelect(topic)}
            className={`flex-1 min-w-[150px] min-h-[50px] py-2 relative bg-blue-200 text-black hover:bg-blue-200/90 flex items-center justify-center pr-10`}
          >
            <span className="px-4 whitespace-normal break-words text-center leading-snug">
              {topic}
            </span>
            <IoCheckmark
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-blue-800 text-3xl flex-shrink-0 ${
                selectedTopics.includes(topic) ? "opacity-100" : "opacity-0"
              }`}
            />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
