/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-03
 * Purpose: For frontend to display live data from question-service
 * Author Review: I validated correctness, security, and performance of the code.
 */

/* AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-10
 * Purpose: Updated the styling of TopicsComponent to make it dynamic and responsive
 * Author Review: I validated correctness and performance of the code.
 */ 

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
import { useState, useEffect } from "react";
import { ALL_TOPICS } from "@/types/topics";
import { fetchTopics } from "@/services/questionServiceApi";

type TopicsProps = {
  setTopics: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TopicsComponent({ setTopics }: TopicsProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const capitalizeWords = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Fetch available topics from question-service on component mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const topics = await fetchTopics();
        setAvailableTopics(topics);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError("Failed to load topics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, []);

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
      <CardContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-6">
        {isLoading && (
          <div className="col-span-full text-white text-center py-8">
            Loading topics...
          </div>
        )}

        {error && (
          <div className="col-span-full text-red-400 text-center py-8">
            {error}
          </div>
        )}

        {!isLoading && !error && availableTopics.length === 0 && (
          <div className="col-span-full text-white text-center py-8">
            No topics available
          </div>
        )}

        {!isLoading &&
          !error &&
          availableTopics.map((topicName) => {
            const displayName = capitalizeWords(topicName);

            return (
              <Button
                key={topicName}
                onClick={() => handleTopicSelect(topicName)}
                className={`h-[60px] relative 
              ${
                selectedTopics.includes(topicName)
                  ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }
              flex items-center justify-center rounded-xl transition-all duration-200`}
              >
                <span className="whitespace-normal break-words text-center leading-snug">
                  {displayName}
                </span>
                <IoCheckmark
                  strokeWidth={3}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-black text-4xl flex-shrink-0 ${
                    selectedTopics.includes(topicName)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
              </Button>
            );
          })}
      </CardContent>
    </Card>
  );
}
