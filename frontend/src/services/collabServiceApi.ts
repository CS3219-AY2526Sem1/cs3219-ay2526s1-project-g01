/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (Claude Sonnet 4.5), date: 2025-11-08
 * Purpose: Added API function for marking question attempts
 * Author Review: Validated correctness and error handling
 */

import { useUser } from "@/contexts/UserContext";
import { getToken } from "./userServiceCookies";
import { toast } from "sonner";

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
      },
    );

    if (!response.ok) {
      console.log("Failed to delete userId to session mapping");
      throw new Error(`Collab service returned ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting userId to session mapping :", error);
    toast.error("Our server is facing some issues, please try again later!");
  }
}

//Makes get request to backend to determine if user has an active session
export async function getUserSessionStatus(
  userId: string,
  setSessionId: (sid: string) => void,
  setshowRejoinRoomDialog: () => void,
) {
  try {
    const token = getToken();
    const response = await fetch(
      `${baseURL}/api/collab/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.log("Failed to get user session status");
      throw new Error(`Collab service returned ${response.status}`);
    }
    const data = await response.json();
    if (data.hasSession) {
      console.log("user has session ongoing");
      setSessionId(data.sessionId);
      setshowRejoinRoomDialog();
    }
  } catch (error) {
    console.log(error);
    console.log("backend down");
    toast.error("Our server is facing some issues, please try again later!");
  }
}

//Get partner user ID from the collab service
export async function getPartnerUserId(userId: string): Promise<string | null> {
  try {
    const token = getToken();
    const response = await fetch(
      `${baseURL}/api/collab/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.log("Failed to get partner user ID");
      return null;
    }
    const data = await response.json();
    if (data.hasSession && data.partnerId) {
      return data.partnerId;
    }
    return null;
  } catch (error) {
    console.error("Error getting partner user ID:", error);
    return null;
  }
}
