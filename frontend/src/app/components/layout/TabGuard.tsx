/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-11-05
 * Purpose: To create a simple client-side tab monitoring system that detects if users open multiple tabs on the same browser
 * Author Review: I validated correctness, security, and performance of the code.
 *
 */

//With reference to https://stackoverflow.com/questions/11008177/stop-people-having-my-website-loaded-on-multiple-tabs
// on BroadcastChannel API

"use client";

import NotAuthorizedDialog from "@/components/ui/not-authorised-dialog";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface TabGuardProps {
  children: ReactNode;
}

export default function TabGuard({ children }: TabGuardProps) {
  const pathname = usePathname();
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  // Don't apply tab guard to authentication/verification routes
  const isAuthRoute = pathname?.startsWith("/auth/verify") || 
                      pathname?.startsWith("/auth/verification") || 
                      pathname?.startsWith("/auth/error") ||
                      pathname?.startsWith("/auth/reset-password");

  useEffect(() => {
    // Skip tab guard for authentication routes
    if (isAuthRoute) {
      return;
    }
    // Create a channel shared by all tabs of this app
    const channel = new BroadcastChannel("app-tabs");

    // When a tab opens, it announces itself to other tabs
    channel.postMessage({ type: "NEW_TAB" });

    // Listen for messages from other tabs
    channel.onmessage = (event) => {
      const { type } = event.data;

      if (type === "NEW_TAB" && !isDuplicate) {
        // A new tab just opened only the  original tab responds
        channel.postMessage({ type: "EXISTING_TAB" });
        console.log("original tab posted existing_tab");
      }

      if (type === "EXISTING_TAB") {
        // Duplicate tab receives this message and shows a dialog box to inform user of existing tab
        console.log("received existing_tab");
        setIsDuplicate(true);
      }

      console.log(isDuplicate);
    };

    return () => channel.close();
  }, [isDuplicate, isAuthRoute]);

  if (isDuplicate) {
    return (
      <div className="bg-stone-900 h-screen">
        <NotAuthorizedDialog
          open={true}
          onClose={() => {}}
          title={"Multiple tabs detected"}
          description={
            "You are only allowed to have one tab opened! Please close this tab."
          }
          buttonName={""}
          showButton={false}
        />
      </div>
    );
  }

  return <>{children}</>;
}
