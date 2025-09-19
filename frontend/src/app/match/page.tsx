import TopicsComponent from "../components/match/TopicsComponent";
import DifficultyComponent from "../components/match/DifficultyComponent";
import SearchComponent from "../components/match/SearchComponent";

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

      <SearchComponent />
    </div>
  );
}
