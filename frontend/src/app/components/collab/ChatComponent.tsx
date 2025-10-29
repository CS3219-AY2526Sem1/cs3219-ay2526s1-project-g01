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

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { SendHorizonalIcon, Mic, MicOff, Video, VideoOff } from "lucide-react";
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

  // Enable audio and mute video by default
  const [localAudioStatus, setLocalAudioStatus] = useState<boolean>(true);
  const [localVideoStatus, setLocalVideoStatus] = useState<boolean>(true);

  // Remote user's audio
  const [remoteAudioStatus, setRemoteAudioStatus] = useState<boolean>(true);

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ],
  };

  const sessionID = "98r4389r43r894389";

  useEffect(() => {
    // Prevent the same user from entering the session twice if its username is undefined
    if (!user || !user.username) {
      return;
    }

    const initializeConnection = async () => {
      try {
        // Create peer connection
        const pc = new RTCPeerConnection(servers);
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
              sessionID,
              username: user?.username,
              candidate: event.candidate,
            });
          }
        };

        // Connect to signaling server
        const socket = io(
          process.env.NEXT_PUBLIC_SIGNALLING_SERVER_URL as string,
          {
            path: "/communication-socket",
          },
        );
        console.log("Conncected to Signalling server successfully");
        socketRef.current = socket;

        socket.on("offer-made", async (offer) => {
          try {
            if (pc.signalingState === "stable") {
              await answerCall(offer);
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

          if (isCaller) {
            setTimeout(() => {
              offerCall();
            }, 500);
          }
        });

        // Join session after all listeners are set up
        socket.emit("join-session", {
          sessionID: sessionID,
          username: user?.username || "anonymous",
        });
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
      const offer = await connectionRef.current.createOffer();
      await connectionRef.current.setLocalDescription(offer);

      socketRef.current?.emit("offer", {
        sessionID,
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
    <div className="flex flex-col h-full bg-stone-900 p-1">
      <div className="flex w-full gap-2 p-2">
        <video
          ref={currentVideoRef}
          autoPlay
          playsInline
          muted
          className="w-[50%]"
        />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-[50%]" />
      </div>

      <div className="flex w-full">
        {/* Button for local stream */}
        <div className="flex gap-2 px-2 w-[50%]">
          <Button
            onClick={() => muteLocalAudio()}
            className="
            text-white 
            bg-stone-900
            border 
            border-white
            hover:bg-stone-500"
          >
            {localAudioStatus ? <Mic /> : <MicOff />}
          </Button>
          <Button
            onClick={() => muteLocalVideo()}
            className="
            text-white 
            bg-stone-900
            border 
            border-white
            hover:bg-stone-500"
          >
            {localVideoStatus ? <Video /> : <VideoOff />}
          </Button>
        </div>

        {/* Button for remote stream */}
        <div className="flex gap-2 px-2 w-[50%]">
          <Button
            onClick={() => muteRemoteAudio()}
            className="
            text-white 
            bg-stone-900
            border 
            border-white
            hover:bg-stone-500"
          >
            {remoteAudioStatus ? <Mic /> : <MicOff />}
          </Button>
        </div>
      </div>

      <div className="flex bg-stone-500 h-full m-2 rounded-lg"></div>

      <div className="flex w-full mt-auto gap-2">
        <Input className="bg-white" placeholder="Type a message..." />
        <Button variant="secondary" size="icon" className="size-9">
          <SendHorizonalIcon />
        </Button>
      </div>
    </div>
  );
}
