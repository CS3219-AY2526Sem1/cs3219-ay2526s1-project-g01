"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { fetchUserStatistics, UserStatistics } from "@/services/questionServiceApi";

export default function StatisticPage() {
  const { user } = useUser();
  const [statistics, setStatistics] = useState<UserStatistics>({
    lastAttempted: null,
    totalAttempts: 0,
    weeklyAttempts: 0,
    favoriteTopics: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const stats = await fetchUserStatistics(user.id);
        setStatistics(stats);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
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
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="px-10 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="min-h-[120px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2 mb-2">
              Last Attempted Question
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : statistics.lastAttempted ? (
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-semibold break-words line-clamp-2">
                  {statistics.lastAttempted.title}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {formatDate(statistics.lastAttempted.attempted_date)}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                  statistics.lastAttempted.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : statistics.lastAttempted.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {statistics.lastAttempted.difficulty}
                </span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">No attempts yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[120px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2 mb-2">
              Total Problems Attempted
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold">{statistics.totalAttempts}</p>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[120px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2 mb-2">
              Questions Attempted in the past week
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold">{statistics.weeklyAttempts}</p>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[120px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2 mb-2">
              Favourite Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : statistics.favoriteTopics.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {statistics.favoriteTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="text-xs sm:text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full break-words"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">No attempts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
