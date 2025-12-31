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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.codebazeacademy.com/";
export const metadata: Metadata = {
  title: "Codebaze Academy",
  description: "Codebaze Academy – Your starting point for learning web development. Beginner-friendly, practical, and designed to help you build real projects from day one.",
   metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  generator: "Codebaze Academy",
  applicationName: "Codebaze Academy",
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: "Codebaze Academy",
    description:
      "Codebaze Academy – Your starting point for learning web development. Beginner-friendly, practical, and designed to help you build real projects from day one.",
    url: BASE_URL,
    siteName: "Codebaze Academy",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 512,
        alt: "Codebaze Academy – Your starting point for learning web development. Beginner-friendly, practical, and designed to help you build real projects from day one.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Codebaze Academy",
    description:
      "Codebaze Academy – Your starting point for learning web development. Beginner-friendly, practical, and designed to help you build real projects from day one.",
    // Use supported Twitter metadata fields. The `app` field is not part of the Next.js Twitter metadata type,
    // so replace it with common fields like `creator` and `images`.
    creator: "@codebaze_x",
    images: ["/twitter-image.png"],
  },
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
