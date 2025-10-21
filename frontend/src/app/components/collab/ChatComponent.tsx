"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import Peer from "peerjs";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { io, Socket } from "socket.io-client";

export default function ChatComponent() {
  
  const sessionId = "1212iuhrhueruhiewr";
  const { user } = useUser();

  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localPeerId, setLocalPeerId] = useState<string>("");

  const [muteAudio, setMuteAudio] = useState<boolean>(false);
  const [currentMute, setCurrentMute] = useState<boolean>(false);

  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const connectedPeersRef = useRef<Set<string>>(new Set());

  // Register user's peerID and listen for calls upon render
  useEffect(() => {

    // Connect to local server for user and session registration
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    // Initialize Peer
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerInstance(peer);
      setLocalPeerId(id);
      setIsConnected(true);
      
      // Register user's peerID and username
      socket.emit("join-session", { 
        sessionID: sessionId, 
        username: user?.username, 
        peerID: id 
      });
    });


    // Once user is registered, start listening for calls
    peer.on("call", (call) => {
      if (currentStreamRef.current) {
        call.answer(currentStreamRef.current);
        
        call.on("stream", (remoteStream) => {
          console.log("Received remote stream from incoming call");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          connectedPeersRef.current.add(call.peer);
        });
      }
    });

    return () => {
      peer.destroy();
      socket.disconnect();
    };
  }, [user]);

  // Once user is registered, we can start checking if the other user is done registering
  // Once both users are registered, we use sorting to determine who will be the one making the call
  useEffect(() => {
    if (!socketRef.current || !isConnected || !peerInstance) return;

    // Initialize local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (currentVideoRef.current) {
          currentVideoRef.current.srcObject = stream;
          currentStreamRef.current = stream;
        }

        // Listen for peer-ready events
        socketRef.current!.on("peer-ready", ({ peerID, username }) => {
          
          if (peerID === localPeerId || connectedPeersRef.current.has(peerID)) {
            return;
          }

          // Upon receiving the other user's peer id, we need to decide who is the 
          // one making the call and who is the one answering
          const isCaller = localPeerId < peerID;
          
          // Is Caller and local stream is ready for transmission
          if (isCaller && currentStreamRef.current) {
            const call = peerInstance.call(peerID, currentStreamRef.current);
            
            // Other user answers the call
            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
              connectedPeersRef.current.add(peerID);
            });
          } 
        });
      })
  }, [isConnected, localPeerId, peerInstance]);

  return (
    <div className="flex flex-col h-full bg-stone-900 p-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-white mb-2">Local Video (You)</h3>
          <video
            ref={currentVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md border-2 border-gray-400 rounded"
          />
          <p className="text-white text-sm mt-1">Peer ID: {localPeerId}</p>
          <p className="text-white text-sm">User: {user?.username || "Anonymous"}</p>
        </div>
        <div className="flex-1">
          <h3 className="text-white mb-2">Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full max-w-md border-2 border-green-400 rounded"
          />
          <p className="text-white text-sm mt-1">
            Status: {isConnected ? "Connected" : "Connecting..."}
          </p>
          <p className="text-white text-sm">
            Connected to: {Array.from(connectedPeersRef.current).length} peer(s)
          </p>
        </div>
      </div>
      
      <div className="flex w-full mt-auto gap-2">
        <Input 
          className="bg-white flex-1" 
          placeholder="Type a message..." 
        />
        <Button variant="secondary" size="icon" className="size-9">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}