"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <Card className="w-[60%] mr-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Sessions</CardTitle>
      </CardHeader>

      <CardContent>{/* TODO Add scrollable area of sessions */}</CardContent>
    </Card>
  );
}
