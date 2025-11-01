/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-02
 * Purpose: To integrate question data retrieval and display in the collaboration page.
 * Author Review: Verified correctness and functionality of the code.
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Difficulty } from "@/types/difficulty";
import { Question } from "@/services/matchingServiceApi";

interface QuestionComponentProps {
  question?: Question | null;
}

export default function QuestionComponent({ question }: QuestionComponentProps) {
  // If no question data, show loading or placeholder
  if (!question) {
    return (
      <Card className="h-full flex flex-col bg-stone-900 border-black">
        <CardHeader>
          <CardTitle className="text-white text-4xl">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <div className="flex-1 text-white">
            Fetching question details...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Map difficulty to badge color
  const getDifficultyBadge = (difficulty: string) => {
    const difficultyLower = difficulty.toLowerCase();
    if (difficultyLower === "easy") return Difficulty.EASY;
    if (difficultyLower === "medium") return Difficulty.MEDIUM;
    if (difficultyLower === "hard") return Difficulty.HARD;
    return Difficulty.MEDIUM; // default
  };

  return (
    <Card className="h-full flex flex-col bg-stone-900 border-black">
      {/* Question Title and Difficulty */}
      <CardHeader>
        <CardTitle className="text-white text-4xl">{question.title}</CardTitle>
        <div className="flex pt-5 items-start gap-2">
          <Badge className={getDifficultyBadge(question.difficulty)}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
          {question.topics.map((topic) => (
            <Badge key={topic.id} variant="outline" className="text-white">
              {topic.topic}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 overflow-y-auto">
        {/* Question Description */}
        <div className="flex-1 text-white mb-5">
          <h3 className="font-semibold mb-2">Description</h3>
          <p>{question.description}</p>
        </div>

        {/* Test Cases Section */}
        <div className="flex-1 mb-5">
          <h3 className="font-semibold text-white mb-2">Examples</h3>
          {question.test_cases.map((testCase) => (
            <div key={testCase.index} className="mb-3 p-3 bg-black text-white rounded-lg text-sm">
              <p className="mb-1">
                <span className="font-semibold">Example {testCase.index}:</span>
              </p>
              <p className="mb-1">
                <span className="font-semibold">Input:</span> {testCase.input}
              </p>
              <p>
                <span className="font-semibold">Output:</span> {testCase.output}
              </p>
            </div>
          ))}
        </div>

        {/* Constraints Section */}
        <div className="flex-1 text-white">
          <h3 className="font-semibold mb-2">Constraints</h3>
          <p className="text-sm">{question.question_constraints}</p>
        </div>
      </CardContent>
    </Card>
  );
}
