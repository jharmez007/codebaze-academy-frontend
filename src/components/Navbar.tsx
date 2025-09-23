"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useFullscreen } from "../context/FullscreenContext";
import logo from "../../public/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 
  const { fullscreen } = useFullscreen();

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (pathname !== "/") {
      setLoaded(true);
    }
  }, [pathname]);

  if (fullscreen) return null;

  return (
    <header className={`relative w-full bg-black z-50 border-b border-b-white/10
        ${pathname !== "/" && loaded ? "navbar-animate" : ""}
      `}>
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" className="h-7 md:h-10 w-auto" />
        </Link>

        {/* Right Side: Links + Contact */}
        <div className="flex items-center sm:space-x-8">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-20">
            <Link
              href="/"
              className="text-sm tracking-wide uppercase font-extralight transition duration-150 ease-in-out text-white hover:text-[#00bf63]"  
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm tracking-wide uppercase font-extralight transition duration-150 ease-in-out text-white hover:text-[#00bf63]"  
            >
              YouTube
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-white shadow focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* 9 dots morph into X */}
            <div className="relative w-5 h-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-5 h-5 text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Same 9-dot morphing logic as before */}
                {/* Top-left */}
                <circle cx={isOpen ? "5" : "5"} cy={isOpen ? "5" : "5"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "9" : "12"} cy={isOpen ? "9" : "5"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "19" : "19"} cy={isOpen ? "5" : "5"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "9" : "5"} cy={isOpen ? "15" : "12"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx="12" cy="12" r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "15" : "19"} cy={isOpen ? "9" : "12"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "5" : "5"} cy={isOpen ? "19" : "19"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "15" : "12"} cy={isOpen ? "15" : "19"} r="1.8" className="transition-all duration-300 ease-in-out" />
                <circle cx={isOpen ? "19" : "19"} cy={isOpen ? "19" : "19"} r="1.8" className="transition-all duration-300 ease-in-out" />
              </svg>
            </div>
          </button>

          {/* Contact Button */}
          <Link
            href="/login"
            className="max-sm:hidden bg-[#00bf63] font-bold text-white md:ml-8 px-8 py-4 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-[#00bf63]/50 hover:shadow-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`
            md:hidden absolute
            max-sm:w-60 w-65 bg-white shadow-lg p-5 space-y-1
            sm:left-1/2 sm:-translate-x-1/2
            max-sm:right-5 max-sm:top-full
            transition-all duration-700 ease-out
            transform
            ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-3 invisible"}
        `}
      >
        <Link
          href="/"
          className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
        >
          Blog
        </Link>

        <Link
          href="/about"
          className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
        >
          YouTube
        </Link>

        <hr className="my-2 border-gray-200" />

        <Link
          href="/login"
          className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
