"use client";

import Link from "next/link";
import { useFullscreen } from "../context/FullscreenContext"; 
import { usePathname  } from "next/navigation";

const Footer = () => {
  const { fullscreen } = useFullscreen();
  const pathname = usePathname();
  
  // ✅ Determine container width dynamically
  const containerWidth =
    pathname.startsWith("/course") || pathname.startsWith("/checkout") || pathname.startsWith("/profile-settings") ? "max-w-7xl" : "max-w-5xl";

  if (fullscreen) return null; 

  return (
    <footer className="w-full bg-black border-t border-t-white/10 py-8">
      <div className={`${containerWidth} flex max-w-5xl text-lg mx-auto space-x-6 p-6 text-gray-500`}>
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
