import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react";

export default function ChatComponent() {

  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      <div className="flex bg-stone-500 h-full mb-3 rounded-lg m-2">

      </div>
      <div className="flex w-full mt-auto gap-2 p-2">
        <Input className="bg-white" />
        <Button 
          variant="secondary" 
          size="icon" 
          className="size-9 rounded-full">
          <SendHorizonalIcon />
        </Button>
      </div>
    </div>
  );
}
