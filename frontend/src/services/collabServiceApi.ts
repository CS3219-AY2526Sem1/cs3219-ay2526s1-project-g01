import { useUser } from "@/contexts/UserContext";
import { getToken } from "./userServiceCookies";

//Makes delete request to backend to delete userID TO {sessionId, partnerid} mapping
export async function deleteSession(userId: string) {
  try {
    const token = getToken();
    const collabURL = process.env.NEXT_PUBLIC_COLLAB_URL;
    const response = await fetch(`${collabURL}/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting userId to session mapping :", error);
  }
}

//Makes get request to backend to determine if user has an active session
export async function getUserSessionStatus(
  userId: string,
  setSessionId: (sid: string) => void,
  setshowRejoinRoomDialog: () => void
) {
  try {
    console.log("call get endpoint to check if have session");
    const collabURL = process.env.NEXT_PUBLIC_COLLAB_URL;
    const token = getToken();
    const response = await fetch(`${collabURL}/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.hasSession) {
      console.log("user has session ongoing");
      setSessionId(data.sessionId);
      setshowRejoinRoomDialog();
    }
  } catch (error) {
    console.log(error);
  }
}
