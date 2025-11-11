/**
 * References / Credits:
 * 1. Video SDK WebRTC guide: https://www.videosdk.live/developer-hub/webrtc/webrtc-project
 * 2. YouTube tutorial: https://youtu.be/QsH8FL0952k
 * 3. YouTube tutorial: https://youtu.be/WmR9IMUD_CY
 *
 * These resources were referenced for both the server and frontend implementation.
 * Code has been modified to support a session-based setup where users must join
 * a session room using a session ID before establishing the WebRTC connection.
 */

/**
 * AI Assistance Disclosure:
 * Tool: Claude Code (model: Claude Sonnet 4.5), date: 2025-11-06
 * Purpose: Separated voice/video chat functionality from ChatComponent to fix video unmounting issue
 * Author Review: Component isolation and WebRTC lifecycle management validated
 */

/* AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-11-10
 * Purpose: Updated the styling of VoiceChatComponent to make it dynamic and responsive
 * Author Review: I validated correctness and performance of the code.
 */

"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function VoiceChatComponent(
  { sessionId }: { sessionId: string | null },
) {
  const { user } = useUser();

  const socketRef = useRef<Socket | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);
  const isCallerRef = useRef<boolean>(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Enable audio and mute video by default
  const [localAudioStatus, setLocalAudioStatus] = useState<boolean>(true);
  const [localVideoStatus, setLocalVideoStatus] = useState<boolean>(true);

  // Remote user's audio
  const [remoteAudioStatus, setRemoteAudioStatus] = useState<boolean>(true);

  // Remote user's connection status
  const [remoteConnectionStatus, setRemoteConnectionStatus] =
    useState<boolean>(false);

  useEffect(() => {
    // Prevent the same user from entering the session twice if its username is undefined
    if (!user || !user.username) {
      return;
    }

    const initializeConnection = async () => {
      try {
        const res = await fetch("/api/turn");
        const iceServers = await res.json();

        // Create peer connection
        const pc = new RTCPeerConnection({ iceServers });
        connectionRef.current = pc;

        let stream = null;

        try {
          // Get media stream first
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        } catch (error) {
          console.error("User refuses to give permission:", error);
        }

        // If user gives permission to use media devices, then we can send over our stream
        if (stream && currentVideoRef.current) {
          currentVideoRef.current.srcObject = stream;
          currentStreamRef.current = stream;

          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
        }

        // Set up event handlers
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit("ice-candidate", {
              sessionId,
              username: user?.username,
              candidate: event.candidate,
            });
          }
        };

        // Connect to signaling server
        const socket = io(
          process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL as string,
          {
            path: "/communication-socket/",
          },
        );
        console.log("Connected to Signalling server successfully");
        socketRef.current = socket;

        socket.on("offer-made", async (offer) => {
          try {
            if (pc.signalingState === "stable") {
              await answerCall(offer);
            } else {
              console.warn(
                "Ignoring offer - not in stable state:",
                pc.signalingState,
              );
            }
          } catch (error) {
            console.error("Error handling offer:", error);
          }
        });

        socket.on("offer-accepted", async (answer) => {
          try {
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));

              for (const candidate of pendingCandidatesRef.current) {
                try {
                  await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                  console.error("Error adding queued candidate:", err);
                }
              }
              pendingCandidatesRef.current = [];
            }
          } catch (error) {
            console.error("Error handling answer:", error);
          }
        });

        socket.on("ice-candidate", async (candidate) => {
          try {
            if (pc.remoteDescription && pc.remoteDescription.type) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
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

          setRemoteConnectionStatus(true);

          if (isCaller) {
            setTimeout(() => {
              offerCall();
            }, 500);
          }
        });

        socket.on("peer-left", () => {
          setRemoteConnectionStatus(false);
        });

        // Join session after all listeners are set up
        socket.emit("join-session", {
          sessionId: sessionId,
          username: user?.username || "anonymous",
        });
      } catch (error) {
        console.error("Error initializing connection:", error);
      }
    };

    initializeConnection();

    return () => {
      socketRef.current?.emit("leave-session", {
        sessionId,
        username: user?.username,
      });

      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (connectionRef.current) {
        connectionRef.current.close();
        connectionRef.current = null;
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
      const offer = await connectionRef.current.createOffer();
      await connectionRef.current.setLocalDescription(offer);

      socketRef.current?.emit("offer", {
        sessionId,
        username: user?.username,
        offer,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }

  async function answerCall(offer: RTCSessionDescriptionInit) {
    if (!connectionRef.current) return;

    try {
      // Check if we're in the right state to set remote description
      if (
        connectionRef.current.signalingState !== "stable" &&
        connectionRef.current.signalingState !== "have-local-offer"
      ) {
        console.warn(
          "Cannot answer call - incorrect signaling state:",
          connectionRef.current.signalingState,
        );
        return;
      }

      await connectionRef.current.setRemoteDescription(offer);

      // Process queued ICE candidates
      for (const candidate of pendingCandidatesRef.current) {
        try {
          await connectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        } catch (err) {
          console.error("Error adding queued candidate:", err);
        }
      }
      pendingCandidatesRef.current = [];

      const answer = await connectionRef.current.createAnswer();
      await connectionRef.current.setLocalDescription(answer);

      socketRef.current?.emit("answer", {
        sessionId,
        username: user?.username,
        answer,
      });
    } catch (error) {
      console.error("Error answering call:", error);
    }
  }

  async function muteLocalAudio() {
    const currentAudio = currentStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "audio");

    if (currentAudio) {
      if (currentAudio?.enabled) {
        currentAudio.enabled = false;
        setLocalAudioStatus(false);
      } else if (!currentAudio?.enabled) {
        currentAudio.enabled = true;
        setLocalAudioStatus(true);
      }
    }
  }

  async function muteLocalVideo() {
    const currentVideo = currentStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "video");

    if (currentVideo) {
      if (currentVideo?.enabled) {
        currentVideo.enabled = false;
        setLocalVideoStatus(false);
      } else if (!currentVideo?.enabled) {
        currentVideo.enabled = true;
        setLocalVideoStatus(true);
      }
    }
  }

  async function muteRemoteAudio() {
    if (remoteVideoRef.current) {
      if (remoteVideoRef.current.muted) {
        remoteVideoRef.current.muted = false; // Unmute other user
        setRemoteAudioStatus(true);
      } else {
        remoteVideoRef.current.muted = true; // Mute other user
        setRemoteAudioStatus(false);
      }
    }
  }

  return (
    <div className="bg-stone-900 p-2 rounded-lg flex flex-col min-h-0">
      <div className="flex w-full gap-2 mb-2 min-h-0">
        <video
          ref={currentVideoRef}
          autoPlay
          playsInline
          muted
          className="w-[50%] rounded aspect-video object-cover"
        />
        {remoteConnectionStatus && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[50%] rounded aspect-video object-cover"
          />
        )}
      </div>

      <div className="flex w-full gap-2 flex-shrink-0">
        {/* Button for local stream */}
        <div className="flex gap-2 w-[50%]">
          <Button
            onClick={() => muteLocalAudio()}
            className="
            flex-1
            text-white
            bg-stone-900
            border
            border-white
            hover:bg-stone-500
            py-1"
          >
            {localAudioStatus ? <Mic size={16} /> : <MicOff size={16} />}
          </Button>
          <Button
            onClick={() => muteLocalVideo()}
            className="
            flex-1
            text-white
            bg-stone-900
            border
            border-white
            hover:bg-stone-500
            py-1"
          >
            {localVideoStatus ? <Video size={16} /> : <VideoOff size={16} />}
          </Button>
        </div>

        {/* Button for remote stream */}
        <div className="flex gap-2 w-[50%]">
          <Button
            onClick={() => muteRemoteAudio()}
            className="
            flex-1
            text-white
            bg-stone-900
            border
            border-white
            hover:bg-stone-500
            py-1"
          >
            {remoteAudioStatus ? <Mic size={16} /> : <MicOff size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
