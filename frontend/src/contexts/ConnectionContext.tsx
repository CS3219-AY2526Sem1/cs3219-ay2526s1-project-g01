/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-11-06
 * Purpose: To implement React ConnectionContext for managing internet connection state.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import React, { createContext, useContext, useState } from "react";

type ConnectionContextType = {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined,
);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionContext = () => {
  const context = useContext(ConnectionContext);
  if (!context)
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  return context;
};
