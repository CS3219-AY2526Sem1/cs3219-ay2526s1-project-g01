"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import Peer from "peerjs";
import { useState, useEffect, useRef } from "react";

export default function ChatComponent() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize PeerJS and get local stream once
  useEffect(() => {
    const p = new Peer();

    // Get own peer ID
    p.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setPeerId(id);
    });

    // Get local media stream and stream it on current video element
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }
      });

    setPeer(p);

    return () => p.destroy();
  }, []);

  // Offer the call to remote peer
  function offerCall() {
    if (!peer || !localStreamRef.current) return;

    // Send current stream to remote peer
    const call = peer.call(remoteId, localStreamRef.current);

    // If remote peer accepts call, set remote stream to remote video element
    call.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      }
    });
  }

  // Answer incoming calls from remote peers
  function answerCall() {
    if (!peer || !localStreamRef.current) return;

    // Answer call by sending current stream over
    peer.on("call", (call) => {
      call.answer(localStreamRef.current as MediaStream);

      // Retrieve the caller stream and set it to remote video element
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });
    });
  }

  return (
    <div className="flex flex-col h-full bg-stone-900 p-1">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted
      />
      <Button onClick={() => offerCall()}>CALL</Button>
      <Button onClick={() => answerCall()}>ANSWER</Button>
      <div className="flex w-full mt-auto gap-2">
        <Input className="bg-white" />
        <Button variant="secondary" size="icon" className="size-9">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
