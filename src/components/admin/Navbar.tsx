"use client";

import { useRouter } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; 

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Get user initials (fallback: first 2 letters of email)
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "AD"; // default
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="hidden sm:block w-full max-w-md px-4 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/admin/system-settings")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                logout(); 
                router.push("/admin-login");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
