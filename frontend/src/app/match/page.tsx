import { IoIosSettings } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopicsComponent from "../components/match/TopicsComponent";
import DifficultyComponent from "../components/match/DifficultyComponent";

export default function MatchPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mt-30">Find your coding partner</h1>
        <h1 className="text-lg m-2">
          Set your preferences and we will find the best match for you!
        </h1>
      </div>

      <DifficultyComponent />

      <TopicsComponent />

      <Button className="mb-15 w-[80%]">Find my partner</Button>
    </div>
  );
}
