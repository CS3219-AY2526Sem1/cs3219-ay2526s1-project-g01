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
        });
      });

    // Listen for remote streams sent by other user
    connectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Exchange ice candidates
    connectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", {
          sessionID,
          username: user?.username,
          candidate: event.candidate,
        });
      }
    };

    // Connect to signalling server
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    // Listen if an offer is made by the other user
    socket.on("offer-made", async (offer) => {
      if (
        connectionRef.current?.signalingState === "stable" &&
        !isCallerRef.current
      ) {
        await answerCall(offer);
      }
    });

    // Listen if an answer is made by the other user
    socket.on("offer-accepted", async (answer) => {
      if (connectionRef.current?.signalingState === "have-local-offer") {
        await connectionRef.current?.setRemoteDescription(answer);
      }
    });

    // Exchange ice candidates
    socket.on("ice-candidate", async (candidate) => {
      await connectionRef.current?.addIceCandidate(candidate);
    });

    // Join the session
    socket.emit("join-session", {
      sessionID: sessionID,
      username: user?.username || "anonymous",
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Once user has joined the session, we check if other user has joined the session as well
  useEffect(() => {
    // Check if the other user has joined the session
    socketRef.current!.on("peer-ready", (username) => {
      const ownUserName = user?.username || "anonymous";

      if (username == ownUserName) return;

      const isCaller = ownUserName < username;

      // If I am the caller, then I will call the other user
      if (isCaller && currentStreamRef.current) {
        offerCall();
      }
    });
  }, [user]);

  // Function for creating offer
  async function offerCall() {
    if (!connectionRef.current) return;

    const offer = await connectionRef.current?.createOffer();
    await connectionRef.current?.setLocalDescription(offer);

    socketRef.current?.emit("offer", {
      sessionID,
      username: user?.username,
      offer,
    });
  }

  // Function for acception offer
  async function answerCall(offer: RTCSessionDescriptionInit) {
    if (!connectionRef.current) return;

    await connectionRef.current?.setRemoteDescription(offer);

    const answer = await connectionRef.current?.createAnswer();
    await connectionRef.current?.setLocalDescription(answer);

    socketRef.current?.emit("answer", {
      sessionID,
      username: user?.username,
      answer,
    });
  }

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
