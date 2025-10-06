"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export default function StatisticPage() {
  return (
    <div className="h-[10%] flex justify-evenly">
      <Card className="mx-10 w-[30%] h-full">
        <CardHeader>
          <CardTitle>Total time spent coding</CardTitle>
        </CardHeader>
      </Card>

      <Card className="mx-10 w-[30%] h-full">
        <CardHeader>
          <CardTitle>Total Problems Solved</CardTitle>
        </CardHeader>
      </Card>

      <Card className="mx-10 w-[30%] h-full">
        <CardHeader>
          <CardTitle>Sessions Completed</CardTitle>
        </CardHeader>
      </Card>

      <Card className="mx-10 w-[30%] h-full">
        <CardHeader>
          <CardTitle>Favourite Topic</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
