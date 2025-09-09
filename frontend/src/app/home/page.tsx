import HistoryPage from "../components/home/HistoryComponent";
import QuickActionsPage from "../components/home/QuickActionsComponent";
import StatisticPage from "../components/home/StatisticComponent";
import WelcomePage from "../components/home/WelcomeComponent";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center bg-white w-full h-[5%]">
        <div className="ml-4 text-black">hamburger</div>
        <div className="text-black font-bold">PeerPrep</div>
        <div className="ml-4 text-black">Avatar</div>
      </div>

      <WelcomePage />

      <StatisticPage />

      <div className="flex flex-1 m-10">
        <HistoryPage />
        <QuickActionsPage />
      </div>
    </div>
  );
}
