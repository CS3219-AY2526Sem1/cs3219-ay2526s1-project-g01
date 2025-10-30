/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (GPT-5), date: 2025-10-30
 * Purpose: To securely fetch ephemeral TURN server credentials for WebRTC connections in a Next.js App Router API route.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      `https://peerprep-communication.metered.live/api/v1/turn/credentials?apiKey=${process.env.METERED_API_KEY}`
    );

    const iceServers = await response.json();

    return NextResponse.json(iceServers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
