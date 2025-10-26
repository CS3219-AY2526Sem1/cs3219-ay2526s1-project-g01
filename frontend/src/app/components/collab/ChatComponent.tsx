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

  // Initialize everything in one useEffect to avoid race conditions
  useEffect(() => {
    const initializeConnection = async () => {
      // Get media stream first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (currentVideoRef.current) {
        currentVideoRef.current.srcObject = stream;
        currentStreamRef.current = stream;
      }

      // Create peer connection
      const pc = new RTCPeerConnection(servers);
      connectionRef.current = pc;

      // Add tracks to connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Set up event handlers
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("ice-candidate", {
            sessionID,
            username: user?.username,
            candidate: event.candidate,
          });
        }
      };

      // Connect to signaling server
      const socket = io(
        process.env.NEXT_PUBLIC_SIGNALLING_SERVER_URL as string,
      );
      socketRef.current = socket;

      socket.on("offer-made", async (offer) => {
        console.log(
          "Received offer, current signaling state:",
          pc.signalingState,
        );
        if (pc.signalingState === "stable" && !isCallerRef.current) {
          await answerCall(offer);
        }
      });

      socket.on("offer-accepted", async (answer) => {
        console.log(
          "Received answer, current signaling state:",
          pc.signalingState,
        );
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(answer);
        }
      });

      socket.on("ice-candidate", async (candidate) => {
        try {
          await pc.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      });

      socket.on("peer-ready", (data) => {
        const username = typeof data === "string" ? data : data.username;
        console.log("Peer ready:", username);

        const ownUserName = user?.username || "anonymous";
        if (username === ownUserName) return;

        const isCaller = ownUserName < username;
        isCallerRef.current = isCaller;

        if (isCaller) {
          console.log("I am the caller, making offer");
          offerCall();
        }
      });

      // Join session after all listeners are set up
      socket.emit("join-session", {
        sessionID: sessionID,
        username: user?.username || "anonymous",
      });
    };

    initializeConnection();

    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  async function offerCall() {
    if (!connectionRef.current) return;

    const offer = await connectionRef.current.createOffer();
    await connectionRef.current.setLocalDescription(offer);

    socketRef.current?.emit("offer", {
      sessionID,
      username: user?.username,
      offer,
    });
  }

  async function answerCall(offer: RTCSessionDescriptionInit) {
    if (!connectionRef.current) return;

    await connectionRef.current.setRemoteDescription(offer);
    const answer = await connectionRef.current.createAnswer();
    await connectionRef.current.setLocalDescription(answer);

    socketRef.current?.emit("answer", {
      sessionID,
      username: user?.username,
      answer,
    });
  }

  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      <div className="flex w-full gap-2">
        <video
          ref={currentVideoRef}
          autoPlay
          playsInline
          muted
          className="w-[50%]"
        />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-[50%]" />
      </div>

      <div className="flex bg-stone-500 h-full mb-5 rounded-lg"></div>

      <div className="flex w-full mt-auto gap-2">
        <Input className="bg-white" placeholder="Type a message..." />
        <Button variant="secondary" size="icon" className="size-9">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
