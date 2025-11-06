/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-02
 * Purpose: To integrate question data retrieval and display in the collaboration page.
 * Author Review: Verified correctness and functionality of the code.
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import ChatComponent from "../components/collab/ChatComponent";
import CodingComponentWrapper from "../components/collab/CodingComponentWrapper";
import QuestionComponent from "../components/collab/QuestionComponent";
import SessionHeader from "../components/collab/SessionHeader";
import { useSearchParams, useRouter } from "next/navigation";
import DisconnectAlertDialog from "@/components/ui/alert-dialog";
import NotAuthorizedDialog from "@/components/ui/not-authorised-dialog";
import { useUser } from "@/contexts/UserContext";
import { endSession } from "@/services/matchingServiceApi";
import { editorWebSocketManager } from "@/services/editorSocketManager";
import { deleteSession } from "@/services/collabServiceApi";
import { Question } from "@/services/matchingServiceApi";

function CollabPageContent() {
  const [showConfirmationAlert, setshowConfirmationAlert] =
    useState<boolean>(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState<boolean>(true);
  const [blockUser, setblockUser] = useState<boolean>(true);
  const router = useRouter();
  const { user, setUser } = useUser();
  const [question, setQuestion] = useState<Question | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  //Delete userId to {sessionId, parternId} mapping in backend server
  async function directToMatch() {
    if (user?.id) {
      try {
        await endSession(user.id);
        await deleteSession(user.id);
      } catch (error) {
        console.error("Failed to end session:", error);
      }
    }
    router.replace("/match");
  }

  useEffect(() => {
    if (editorWebSocketManager.getSocket()) {
      setblockUser(false);
    }
  }, []);

  // Retrieve question data from sessionStorage
  useEffect(() => {
    if (sessionId) {
      const questionData = sessionStorage.getItem(`question_${sessionId}`);
      if (questionData) {
        try {
          const parsedQuestion = JSON.parse(questionData);
          setQuestion(parsedQuestion);
          console.log("Question data loaded:", parsedQuestion);
        } catch (error) {
          console.error("Error parsing question data:", error);
        }
      }
    }
  }, [sessionId]);

  if (blockUser) {
    return (
      <>
        <div className="bg-stone-900 h-screen" />;
        <NotAuthorizedDialog
          open={blockUser}
          onClose={() => {
            router.replace("/match");
          }}
          title={"Unauthorised Access"}
          description={
            "You can only access the code editor after you are matched with a partner through our system"
          }
          buttonName={"Back"}
        />
      </>
    );
  }

  return (
    <main className="bg-stone-900 h-screen flex flex-col items-center">
      <SessionHeader
        showConfirmationAlert={() => {
          setshowConfirmationAlert(true);
        }}
      />

      <div className="flex flex-1 w-full bg-black ">
        <div className="flex-1 p-5">
          <QuestionComponent question={question} />
        </div>

        <div className="flex-[2]">
          <CodingComponentWrapper
            isOpen={showLoadingDialog}
            closeDialog={() => setShowLoadingDialog(false)}
            onLeave={() => directToMatch()}
          />
        </div>

        <div className="flex-1 p-5">
          <ChatComponent />
        </div>
        <DisconnectAlertDialog
          open={showConfirmationAlert}
          onAccept={() => directToMatch()}
          onReject={() => setshowConfirmationAlert(false)}
          buttonOneTitle="Yes"
          buttonTwoTitle="No"
          title="Leave Session"
          description="Are you sure you want to leave?"
        />
      </div>
    </main>
  );
}

export default function CollabPage() {
  return (
    <Suspense fallback={<div className="bg-stone-900 h-screen" />}>
      <CollabPageContent />
    </Suspense>
  );
}
