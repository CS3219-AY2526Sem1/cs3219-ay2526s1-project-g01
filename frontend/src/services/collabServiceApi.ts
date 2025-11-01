import { useUser } from "@/contexts/UserContext";

export async function deleteSession(userId: string) {
  try {
    const collabURL = process.env.NEXT_PUBLIC_COLLAB_URL;
    const response = await fetch(`${collabURL}/${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting userId to session mapping :", error);
  }
}
