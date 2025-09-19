"use client";

import { CiBookmark } from "react-icons/ci";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TopicsComponent() {
  return (
    <Card className="w-[80%] flex-1 m-10">
      <div className="flex w-full ">
        <CiBookmark className="ml-3 mt-1 text-2xl" />
        <CardHeader className="ml-5 flex-1 ml-0 pl-3">
          <CardTitle className="text-2xl font-bold">Topics</CardTitle>
          <CardDescription>
            Choose the topics that you want to focus on
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="flex justify-evenly h-full items-center gap-3">
        <Button className="flex-1 h-[50%] bg-gray-200 text-black">
          Strings
        </Button>

        <Button className="flex-1 h-[50%] bg-gray-200 text-black">
          Linked Lists
        </Button>

        <Button className="flex-1 h-[50%] bg-gray-200 text-black">
          Dyanmic Programming
        </Button>
      </CardContent>
    </Card>
  );
}
