import HistoryPage from "../components/home/HistoryComponent";
import QuickActionsPage from "../components/home/QuickActionsComponent";
import StatisticPage from "../components/home/StatisticComponent";
import WelcomePage from "../components/home/WelcomeComponent";

export default function HomePage() {
  return (
    <div
      className="
      min-h-[calc(100vh-65px)] 
      flex flex-col
      bg-radial-[at_75%_75%] to-zinc-900 from-white to-75%"
    >
      <WelcomePage />
      <StatisticPage />
      <div className="flex flex-col lg:flex-row flex-1 px-10 pb-10 gap-4">
        <HistoryPage />
        <QuickActionsPage />
      </div>
    </div>
  );
}
