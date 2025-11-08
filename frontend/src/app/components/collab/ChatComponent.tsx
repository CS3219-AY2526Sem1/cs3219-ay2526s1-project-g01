/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2025-11-06
 * Purpose: Simplified ChatComponent to only handle text chat, video/audio moved to VoiceChatComponent
 * Author Review: Component refactoring and separation of concerns validated
 * /

/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-08
 * Purpose: Modified to use shared Yjs document for chat synchronization
 * Author Review: Yjs integration with shared document validated
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as Y from "yjs";
import { useUser } from "@/contexts/UserContext";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
}

interface ChatComponentProps {
  ydoc: Y.Doc | null;
}

export default function ChatComponent({ ydoc }: ChatComponentProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const user_id: string = user?.id || "0";
  const user_name: string = user?.username || "Unknown";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!ydoc) {
      return;
    }

    const yChatMessages: Y.Array<ChatMessage> = ydoc.getArray("chatMessages");

    // Observe changes to the Yjs array
    const observer = () => {
      setMessages(yChatMessages.toArray());
    };

    yChatMessages.observe(observer);

    // Load initial messages
    setMessages(yChatMessages.toArray());

    return () => {
      yChatMessages.unobserve(observer);
    };
  }, [ydoc, user_id]);

  function handleSend() {
    if (inputValue.trim() !== "" && ydoc) {
      // Create new message
      const newMessage: ChatMessage = {
        id: `${user_id}-${Date.now()}`,
        userId: user_id,
        username: user_name,
        content: inputValue.trim(),
        timestamp: Date.now(),
      };

      // Get Yjs array and add message
      const yChatMessages: Y.Array<ChatMessage> = ydoc.getArray("chatMessages");
      yChatMessages.push([newMessage]);

      setInputValue("");
    }
  }

  return (
    <div className="flex flex-col h-full bg-stone-900 rounded-lg p-2">
      {/* Chat messages area */}
      <div className="flex flex-col bg-stone-500 h-full mb-2 rounded-lg overflow-auto p-2">
        {messages.map((message) => {
          const isCurrentUser = message.userId === user_id;
          return (
            <div
              key={message.id}
              className={"flex m-2" + (isCurrentUser ? " ml-auto" : " mr-auto")}
            >
              <div className="bg-white rounded-lg text-black p-2 max-w-xs">
                {message.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="flex w-full gap-2">
        <Input
          className="bg-white"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Type a message..."
        />
        <Button
          variant="secondary"
          size="icon"
          className="size-9"
          onClick={handleSend}
        >
          <SendHorizonalIcon />
        </Button>
      </div>
    </div>
  );
}
