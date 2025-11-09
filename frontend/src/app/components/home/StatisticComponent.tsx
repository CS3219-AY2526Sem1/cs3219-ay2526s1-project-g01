"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export default function StatisticPage() {
  return (
    <div className="px-10 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="min-h-[100px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2">
              Last Attempted Question
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="min-h-[100px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2">
              Total Problems Attempted
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="min-h-[100px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2">
              Questions Attempted in the past week
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="min-h-[100px] flex flex-col">
          <CardHeader className="flex-1 p-4">
            <CardTitle className="text-sm sm:text-base md:text-lg break-words line-clamp-2">
              Favourite Topic
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
