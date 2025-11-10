/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2025-11-06
 * Purpose: Simplified ChatComponent to only handle text chat, video/audio moved to VoiceChatComponent
 * Author Review: Component refactoring and separation of concerns validated
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react";

export default function ChatComponent() {
  return (
    <div className="flex flex-col h-full bg-stone-900 rounded-lg p-2">
      {/* Chat messages area */}
      <div className="flex bg-stone-500 h-full mb-2 rounded-lg overflow-auto scrollbar-hide">
        {/* TODO: Implement chat messages display */}
      </div>

      {/* Chat input */}
      <div className="flex w-full gap-2">
        <Input className="bg-white" placeholder="Type a message..." />
        <Button variant="secondary" size="icon" className="size-9">
          <SendHorizonalIcon />
        </Button>
      </div>
    </div>
  );
}
