/* AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-10
 * Purpose: Updated StatisticComponent to fetch and display user statistics
 * Author Review: I validated correctness, security, and performance of the code.
 */ 

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { fetchUserStatistics, UserStatistics } from "@/services/questionServiceApi";

export default function StatisticPage() {
  const { user } = useUser();
  const [statistics, setStatistics] = useState<UserStatistics>({
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <Card className="min-h-[140px] flex flex-col">
          <CardHeader className="flex-1 p-4 text-center">
            <CardTitle className="text-xl sm:text-lg md:text-2xl break-words line-clamp-2">
              Total Problems Attempted
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-center">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold">{statistics.totalAttempts}</p>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[140px] flex flex-col">
          <CardHeader className="flex-1 p-4 text-center">
            <CardTitle className="text-xl sm:text-lg md:text-2xl break-words line-clamp-2">
              Questions Attempted in the past week
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-center">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold">{statistics.weeklyAttempts}</p>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[140px] flex flex-col sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex-1 p-4 text-center">
            <CardTitle className="text-xl sm:text-lg md:text-2xl break-words line-clamp-2">
              Favourite Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-center">
            {loading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
            ) : statistics.favoriteTopics.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-center">
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
