"use client";

import { Message, MessageContent } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import * as Y from "yjs";

interface ChatMessageProps {
  messages: string[];
  onSend: (msg: string) => void;
}

export default function ChatComponent({ messages, onSend }: ChatMessageProps) {
  const [inputValue, setInputValue] = useState("");

  const currentUser = "ml-auto mr-2";
  const otherUser = "mr-auto";

  function handleSend() {
    if (inputValue.trim() !== "") {
      onSend(inputValue);
      setInputValue("");
    }
  }

  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      {/* Chat Box */}
      <div className="flex flex-col bg-stone-500 h-full mb-5 rounded-lg">
        {messages.map((message, index) => {
          return (
            <div key={index} className="flex">
              <Message
                from="user"
                className={index % 2 == 0 ? currentUser : otherUser}
              >
                <MessageContent>{message}</MessageContent>
              </Message>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="flex w-full mt-auto gap-2">
        <Input
          className="bg-white"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend(inputValue);
              setInputValue("");
            }
          }}
        />
        <Button
          variant="secondary"
          size="icon"
          className="size-9"
          onClick={handleSend}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
