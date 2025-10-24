"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { ChevronRightIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function ChatComponent() {

  const { user } = useUser();

  const socketRef = useRef<Socket | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);
  const isCallerRef = useRef<boolean>(false);

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.1.google.com:19302",
          "stun:stun2.1.google.com:19302",
        ],
      },
    ],
  };



  const sessionID = "98r4389r43r894389";

  // Upon render of page
  useEffect(() => {

    // Set up connection
    connectionRef.current = new RTCPeerConnection(servers);

    // Initialize local media streams
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        // Capture local video and audio in local variables
        if (currentVideoRef.current) {
          currentVideoRef.current.srcObject = stream;
          currentStreamRef.current = stream;
        }

        stream.getTracks().forEach((track) => {
          connectionRef.current?.addTrack(track, stream);
        })
      });

    // Connect to signalling server
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    }
  }, [user]);

  
  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      <div className="flex w-full">
        <video ref={currentVideoRef} autoPlay playsInline />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>

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
