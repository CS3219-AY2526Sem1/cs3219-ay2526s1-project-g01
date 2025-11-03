import { useUser } from "@/contexts/UserContext";
import { getToken } from "./userServiceCookies";

const baseURL = process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL;
//Makes delete request to backend to delete userID TO {sessionId, partnerid} mapping
export async function deleteSession(userId: string) {
  try {
    const token = getToken();
    const response = await fetch(
      `${baseURL}/api/collab/${encodeURIComponent(userId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to delete userId to session mapping");
    }
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
    const token = getToken();
    const response = await fetch(
      `${baseURL}/api/collab/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to get user session status");
    }
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
