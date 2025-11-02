// src/app/(student)/layout.tsx
"use client";

import { FullscreenProvider } from "@/context/FullscreenContext";
import { Navbar, Footer, Chatbot } from "@/components";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <FullscreenProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </FullscreenProvider>
  );
}
