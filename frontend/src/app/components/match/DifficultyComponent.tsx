"use client";

import { IoIosSettings } from "react-icons/io";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DifficultyComponent() {
  return (
    <Card className="w-[80%] flex-1 m-10">
      <div className="flex w-full ">
        <IoIosSettings className="ml-3 mt-1 text-2xl" />
        <CardHeader className="ml-5 flex-1 ml-0 pl-3">
          <CardTitle className="text-2xl font-bold">Difficult Level</CardTitle>
          <CardDescription>
            Select one of more difficulty levels that you would like to practice
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="flex justify-evenly h-full items-center gap-3">
        <Button className="flex-1 h-[50%] bg-green-200 text-black">Easy</Button>

        <Button className="flex-1 h-[50%] bg-yellow-200 text-black">
          Medium
        </Button>

        <Button className="flex-1 h-[50%] bg-red-200 text-black">Hard</Button>
      </CardContent>
    </Card>
  );
}
