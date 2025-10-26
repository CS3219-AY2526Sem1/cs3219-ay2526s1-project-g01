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
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

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
      try {
        // Get media stream first
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
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
          console.log("Received remote track");
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate");
            socketRef.current?.emit("ice-candidate", {
              sessionID,
              username: user?.username,
              candidate: event.candidate,
            });
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", pc.iceConnectionState);
        };

        pc.onsignalingstatechange = () => {
          console.log("Signaling state:", pc.signalingState);
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
          try {
            if (pc.signalingState === "stable") {
              await pc.setRemoteDescription(new RTCSessionDescription(offer));
              console.log("Remote description set from offer");

              // Process queued ICE candidates
              console.log(
                `Processing ${pendingCandidatesRef.current.length} queued candidates`,
              );
              for (const candidate of pendingCandidatesRef.current) {
                try {
                  await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                  console.error("Error adding queued candidate:", err);
                }
              }
              pendingCandidatesRef.current = [];

              // Create and send answer
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              socket.emit("answer", {
                sessionID,
                username: user?.username,
                answer,
              });
              console.log("Answer sent");
            }
          } catch (error) {
            console.error("Error handling offer:", error);
          }
        });

        socket.on("offer-accepted", async (answer) => {
          console.log(
            "Received answer, current signaling state:",
            pc.signalingState,
          );
          try {
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              console.log("Remote description set from answer");

              // Process queued ICE candidates
              console.log(
                `Processing ${pendingCandidatesRef.current.length} queued candidates`,
              );
              for (const candidate of pendingCandidatesRef.current) {
                try {
                  await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                  console.error("Error adding queued candidate:", err);
                }
              }
              pendingCandidatesRef.current = [];
            } else {
              console.warn(
                "Received answer but signaling state is not have-local-offer:",
                pc.signalingState,
              );
            }
          } catch (error) {
            console.error("Error handling answer:", error);
          }
        });

        socket.on("ice-candidate", async (candidate) => {
          console.log(
            "Received ICE candidate, remote description exists:",
            !!pc.remoteDescription,
            "signaling state:",
            pc.signalingState,
          );
          
          try {
            if (pc.remoteDescription && pc.remoteDescription.type) {
              // Remote description is set, add candidate immediately
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log("ICE candidate added successfully");
            } else {
              // Queue the candidate for later
              console.log("Queueing ICE candidate (no remote description yet)");
              pendingCandidatesRef.current.push(candidate);
            }
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
            // Add small delay to ensure both peers are ready
            setTimeout(() => {
              offerCall();
            }, 500);
          }
        });

        socket.on("peer-left", (data) => {
          console.log("Peer left:", data.username);

          // Clear remote video
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }

          // Clear pending candidates
          pendingCandidatesRef.current = [];

          // Reset caller status
          isCallerRef.current = false;
        });

        // Join session after all listeners are set up
        socket.emit("join-session", {
          sessionID: sessionID,
          username: user?.username || "anonymous",
        });

        console.log("Joined session as:", user?.username);
      } catch (error) {
        console.error("Error initializing connection:", error);
      }
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
      // Clear pending candidates
      pendingCandidatesRef.current = [];
    };
  }, [user]);

  async function offerCall() {
    if (!connectionRef.current) return;

    try {
      console.log("Creating offer...");
      const offer = await connectionRef.current.createOffer();
      await connectionRef.current.setLocalDescription(offer);

      socketRef.current?.emit("offer", {
        sessionID,
        username: user?.username,
        offer,
      });
      console.log("Offer sent");
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }

  async function answerCall(offer: RTCSessionDescriptionInit) {
    if (!connectionRef.current) return;

    try {
      await connectionRef.current.setRemoteDescription(offer);
      const answer = await connectionRef.current.createAnswer();
      await connectionRef.current.setLocalDescription(answer);

      socketRef.current?.emit("answer", {
        sessionID,
        username: user?.username,
        answer,
      });
    } catch (error) {
      console.error("Error answering call:", error);
    }
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