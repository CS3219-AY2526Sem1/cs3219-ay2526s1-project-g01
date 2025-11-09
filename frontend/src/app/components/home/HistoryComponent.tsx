/* AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-10
 * Purpose: Updated HistoryComponent to fetch and display recent collaboration sessions
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import {
  fetchRecentAttempts,
  LastAttemptedQuestion,
} from "@/services/questionServiceApi";
import { Calendar, Code2, Users } from "lucide-react";

export default function HistoryPage() {
  const { user } = useUser();
  const [recentSessions, setRecentSessions] = useState<LastAttemptedQuestion[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentSessions = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch last 3 recent attempts
        const sessions = await fetchRecentAttempts(user.id, 3);
        setRecentSessions(sessions);
      } catch (error) {
        console.error("Failed to load recent sessions:", error);
        setRecentSessions([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentSessions();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full lg:w-[60%] lg:mr-3 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold break-words">
          Recent Sessions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Code2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground font-medium mb-1">
              No sessions yet
            </p>
            <p className="text-xs text-muted-foreground">
              Start a collaboration session to see your history here
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {recentSessions.map((session, index) => (
              <div
                key={`${session.question_id}-${index}`}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Header with title and difficulty */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm sm:text-base font-semibold line-clamp-2 flex-1 break-words">
                    {session.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap flex-shrink-0 ${getDifficultyColor(
                      session.difficulty,
                    )}`}
                  >
                    {session.difficulty}
                  </span>
                </div>

                {/* Topics */}
                {session.topics && session.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {session.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded break-words"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer with metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(session.attempted_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>Collaborative</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
