"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <Card className="w-full lg:w-[60%] lg:mr-3">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold break-words">
          Recent Sessions
        </CardTitle>
      </CardHeader>

      <CardContent>{/* TODO Add scrollable area of sessions */}</CardContent>
    </Card>
  );
}
