"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
        {/* Sidebar → fixed to the left */}
        <div className="lg:sticky lg:top-0 h-screen flex-shrink-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1">
          {/* Navbar → sticky at the top */}
          <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-950 border-b">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* Page content (scrolls with body) */}
            <main className="flex-1 p-6 max-lg:w-screen overflow-x-hidden">
              {children}
            </main>
          
        </div>
      </div>
    </ThemeProvider>
  );
}
