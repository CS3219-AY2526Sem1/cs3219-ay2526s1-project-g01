"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatComponent() {
  const chatMessages = ["HELLO", "HOW ARE YOU?"];

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera and audio
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        // Capture local video and audio in local variables
        if (currentVideoRef.current) {
          currentVideoRef.current.srcObject = stream;
          currentStreamRef.current = stream;
        }
      });
  }, []);

  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      <video ref={currentVideoRef} autoPlay playsInline></video>
      <div className="flex bg-stone-500 h-full mb-5 rounded-lg"></div>

      <div className="flex w-full mt-auto gap-2">
        <Input className="bg-white" />
        <Button variant="secondary" size="icon" className="size-9">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
