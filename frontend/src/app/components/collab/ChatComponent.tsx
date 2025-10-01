import { Message, MessageContent } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";

export default function ChatComponent() {
  const chatMessages = ["HELLO", "HOW ARE YOU?"];

  const currentUser = "ml-auto mr-2";
  const otherUser = "mr-auto";

  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      {/* Chat Box */}
      <div className="flex flex-col bg-stone-500 h-full mb-5 rounded-lg">
        {chatMessages.map((message, index) => {
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
        <Input className="bg-white" />
        <Button variant="secondary" size="icon" className="size-9">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
