//With reference to https://www.geeksforgeeks.org/reactjs/how-to-fix-the-error-window-is-not-defined-in-nextjs/ in solving bug

/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-09-23
 * Purpose: To understand root cause of ReferenceError: window is not defined when CollabPage is being built by docker
 * Author Review: I validated correctness of the code and modified the solution based on online research
 */
"use client";

import dynamic from "next/dynamic";

const CodingComponentWrapper = dynamic(
  () => import("../components/collab/CollabComponent"),
  {
    ssr: false,
  },
);

export default CodingComponentWrapper;
