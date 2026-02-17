"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type ScrollNavbarProps = {
  course: {
    title: string;
    slug: string;
  };
};

const ScrollNavbar = ({ course }: ScrollNavbarProps) => {
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 20) {
        setShow(true); // Show navbar when not at the very top
      } else {
        setShow(false); // Hide navbar at the very top
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      } bg-black shadow`}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 gap-2 sm:gap-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center sm:justify-start">
          <Link
            href="/"
            className="font-semibold text-white underline hover:text-gray-400 transition ease-in"
          >
            Code Baze Academy
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400 truncate max-w-[120px] sm:max-w-none">{course.title}</span>
        </div>

        {/* Button */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-2 sm:mt-0">
          <Link
            href={isAuthenticated ? "/products" : `/checkout/${course.slug}`}
            className="w-full sm:w-auto text-center px-4 py-2 sm:px-6 sm:py-3 bg-[#00bf63] text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            {isAuthenticated ? "Go to Course" : "Get access"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ScrollNavbar;