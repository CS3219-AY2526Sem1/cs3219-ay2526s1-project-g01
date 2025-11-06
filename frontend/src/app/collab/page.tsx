"use client";

import { useState, useEffect } from "react";
import ChatComponent from "../components/collab/ChatComponent";
import CodingComponentWrapper from "../components/collab/CodingComponentWrapper";
import QuestionComponent from "../components/collab/QuestionComponent";
import SessionHeader from "../components/collab/SessionHeader";
import { useRouter } from "next/navigation";
import DisconnectAlertDialog from "@/components/ui/alert-dialog";
import NotAuthorizedDialog from "@/components/ui/not-authorised-dialog";
import { useUser } from "@/contexts/UserContext";
import { endSession } from "@/services/matchingServiceApi";
import { editorWebSocketManager } from "@/services/editorSocketManager";
import { deleteSession } from "@/services/collabServiceApi";

export default function CollabPage() {
  const [showConfirmationAlert, setshowConfirmationAlert] =
    useState<boolean>(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState<boolean>(true);
  const [blockUser, setblockUser] = useState<boolean>(true);
  const router = useRouter();
  const { user, setUser } = useUser();

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
          <QuestionComponent />
        </div>

        <div className="flex-[2]">
          <CodingComponentWrapper
            isOpen={showLoadingDialog}
            closeDialog={() => setShowLoadingDialog(false)}
            openDialog={() => setShowLoadingDialog(true)}
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
