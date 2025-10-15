import ChatComponent from "../components/collab/ChatComponent";
import CodingComponentWrapper from "../components/collab/CodingComponentWrapper";
import QuestionComponent from "../components/collab/QuestionComponent";
import SessionHeader from "../components/collab/SessionHeader";

export default function CollabPage() {
  return (
    <main className="bg-stone-900 h-screen flex flex-col items-center">
      <SessionHeader />

      <div className="flex flex-1 w-full bg-stone-800 ">
        <div className="flex-1 p-5">
          <QuestionComponent />
        </div>

        <div className="flex-[2]">
          <CodingComponentWrapper />
        </div>

        <div className="flex-1 p-5">
          <ChatComponent />
        </div>
      </div>
    </main>
  );
}
