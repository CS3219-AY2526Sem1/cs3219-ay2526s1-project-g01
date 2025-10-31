import {
  Database,
  MessageSquareCode,
  Network,
  Brackets,
  ArrowDownZA,
  Brain,
} from "lucide-react";

export enum Topic {
  ALGORITHMS = "Algorithms",
  DATA_STRUCTURES = "Data Structures",
  DATABASES = "Databases",
  ARRAYS = "Arrays",
  STRINGS = "Strings",
  BRAINTEASER = "Brainteaser",
}

export const ALL_TOPICS = [
  { name: Topic.ALGORITHMS, icon: MessageSquareCode, color: "text-blue-500" },
  { name: Topic.DATA_STRUCTURES, icon: Network, color: "text-orange-500" },
  { name: Topic.DATABASES, icon: Database, color: "text-red-500" },
  { name: Topic.ARRAYS, icon: Brackets, color: "text-purple-500" },
  { name: Topic.STRINGS, icon: ArrowDownZA, color: "text-indigo-500" },
  { name: Topic.BRAINTEASER, icon: Brain, color: "text-yellow-300" },
];
