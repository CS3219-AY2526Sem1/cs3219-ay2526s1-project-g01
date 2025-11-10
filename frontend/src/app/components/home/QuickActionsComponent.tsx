"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActionsPage() {
  return (
    <Card className="w-full lg:w-[40%] lg:ml-3">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold break-words">
          Quick Actions
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
