"use client";

import Link from "next/link";
import { useFullscreen } from "../context/FullscreenContext"; 

const Footer = () => {
  const { fullscreen } = useFullscreen();

  if (fullscreen) return null; 

  return (
    <footer className="w-full bg-black border-t border-t-white/10 py-8">
      <div className="flex max-w-5xl text-lg mx-auto space-x-6 p-6 text-gray-500">
        <Link href="/terms" className="hover:text-gray-300">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-gray-300">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
