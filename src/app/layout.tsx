import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codebaze Academy",
  description:
    "Codebaze Academy – Your starting point for learning web development. Beginner-friendly, practical, and designed to help you build real projects from day one.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white flex flex-col min-h-screen scroll-smooth`}
      >
        <AuthProvider>{children}</AuthProvider>
        {/* 🔔 Sonner Toaster */}
        <Toaster position="bottom-center" richColors closeButton />
      </body>
    </html>
  );
}
