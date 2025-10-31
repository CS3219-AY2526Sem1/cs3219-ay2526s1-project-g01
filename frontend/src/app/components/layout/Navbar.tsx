/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To create a reusable navigation bar component for the PeerPrep application.
 * Author Review: I validated correctness, security, and performance of the code.
 *  I modified the styling to match the application's theme.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown, Settings } from "lucide-react";
import { removeToken } from "@/services/userServiceCookies";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/home" },
    { name: "Find Partner", href: "/match" },
  ];

  const handleLogout = () => {
    // Clear user context first
    setUser(null);

    // Clear token from cookies
    removeToken();

    // Clear all localStorage and sessionStorage
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // Use Next.js router.push for client-side navigation
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/home" className="flex items-center space-x-2">
            <Image
              src="/PeerPrepLogo.png"
              alt="PeerPrep Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-black font-bold text-xl">PeerPrep</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || "Guest"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/account")}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
