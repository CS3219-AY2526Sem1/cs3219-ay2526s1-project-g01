import { redirect } from "next/navigation";

export default function RootRedirect() {
  redirect("/home");
  return null;
}
