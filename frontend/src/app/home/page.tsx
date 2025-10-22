import HistoryPage from "../components/home/HistoryComponent";
import QuickActionsPage from "../components/home/QuickActionsComponent";
import StatisticPage from "../components/home/StatisticComponent";
import WelcomePage from "../components/home/WelcomeComponent";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <WelcomePage />
      <StatisticPage />
      <div className="flex flex-1 m-10">
        <HistoryPage />
        <QuickActionsPage />
      </div>
    </div>
  );
}
