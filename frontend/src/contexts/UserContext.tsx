/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-16
 * Purpose: To implement React UserContext for managing user authentication state with automatic token verification and user data fetching from API.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getToken } from "@/services/userServiceCookies";
import { verifyToken } from "@/services/userServiceApi";

interface User {
  id: string;
  username: string;
  email: string;
  onEditor: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("UserContext useEffect triggered, current user:", user);

    // If user context is empty but we have a token, fetch user data
    if (!user) {
      const token = getToken();
      console.log("Token from cookies:", token);

      if (token) {
        console.log("Token found, calling verifyToken API...");
        verifyToken(token)
          .then((response) => {
            console.log("VerifyToken response:", response.data);
            const userData = response.data?.data;
            if (userData?.username && userData?.email) {
              console.log("Setting user data:", userData);
              setUser({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                onEditor: false,
              });
            } else {
              console.log("User data incomplete:", userData);
            }
          })
          .catch((error) => {
            console.error("Error verifying token:", error);
          });
      } else {
        console.log("No token found in cookies");
      }
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
