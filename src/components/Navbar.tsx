"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter  } from "next/navigation";

import { useFullscreen } from "../context/FullscreenContext";
import { useAuth } from "../context/AuthContext";
import logo from "../../public/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false); 


  const pathname = usePathname();
  const router = useRouter();
  const { fullscreen } = useFullscreen();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement | null>(null);


  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (pathname !== "/") {
      setLoaded(true);
    }
  }, [pathname]);


   // ✅ Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setDropdownOpen(false); }, [user]);

  if (fullscreen) return null;

  // ✅ Determine container width dynamically
  const containerWidth =
    pathname.startsWith("/course") || pathname.startsWith("/checkout") ? "max-w-7xl" : "max-w-5xl";

  // ✅ Logout function
  const handleLogout = () => {
    logout();
    router.push("/");
    setTimeout(() => setShowToast(true), 1000);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <header
      className={`relative w-full bg-black z-50 border-b border-b-white/10 ${
        pathname !== "/" && loaded ? "navbar-animate" : ""
      }`}
    >
      {/* ✅ Logout Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}   // start above the screen, invisible
            animate={{ y: 0, opacity: 1 }}     // slide down into view
            exit={{ y: -50, opacity: 0 }}      // slide up when disappearing
            transition={{ type: "spring", stiffness: 500, damping: 30 }} // smooth spring animation
            className="fixed top-0 left-0 w-full bg-green-200 text-green-700 text-center py-10 text-lg shadow-lg z-50"
          >
            Logged out
          </motion.div>
        )}
      </AnimatePresence>


      <div
        className={`${containerWidth} mx-auto flex items-center justify-between px-6 py-4`}
      >
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
              href="https://www.youtube.com/@codebaze-tv"
              target="_blank"
              rel="noopener noreferrer"
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
            {/* 9-dot morphing menu button */}
            <div className="relative w-5 h-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-5 h-5 text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx={isOpen ? "5" : "5"}
                  cy={isOpen ? "5" : "5"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "9" : "12"}
                  cy={isOpen ? "9" : "5"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "19" : "19"}
                  cy={isOpen ? "5" : "5"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "9" : "5"}
                  cy={isOpen ? "15" : "12"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "15" : "19"}
                  cy={isOpen ? "9" : "12"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "5" : "5"}
                  cy={isOpen ? "19" : "19"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "15" : "12"}
                  cy={isOpen ? "15" : "19"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
                <circle
                  cx={isOpen ? "19" : "19"}
                  cy={isOpen ? "19" : "19"}
                  r="1.8"
                  className="transition-all duration-300 ease-in-out"
                />
              </svg>
            </div>
          </button>

           {/* Desktop: Profile or Login */}
            { user  ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E5C9A8] text-sm font-bold text-gray-800 cursor-pointer hover:scale-105 transition-transform"
                >
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg py-2 text-sm z-50">
                    <Link
                      href="/products"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                    >
                      Products
                    </Link>
                    <Link
                      href="/profile-settings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="max-md:hidden bg-[#00bf63] font-bold text-white md:ml-8 px-8 py-4 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-[#00bf63]/50 hover:shadow-lg"
              >
                Login
              </Link>
            )}
        </div>
      </div>

      {/* ✅ Mobile Nav */}
      <div
        className={`
          md:hidden absolute
          max-sm:w-60 w-65 bg-white shadow-lg p-5 space-y-1
          sm:right-0 sm:-translate-x-1/2
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
          href="https://www.youtube.com/@codebaze-tv"
          className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
        >
          YouTube
        </Link>

        <hr className="my-2 border-gray-200" />

        {user ? (
          <>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
            >
              Products
            </Link>
            <Link
              href="/profile-settings"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
            >
              Settings
            </Link>
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="block w-full text-left px-3 py-2 font-medium text-gray-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 font-medium hover:bg-gray-100 text-gray-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
