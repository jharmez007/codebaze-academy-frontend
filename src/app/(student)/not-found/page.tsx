"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotfoundPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-start bg-white px-2 min-h-screen">
      <div className="w-full max-w-xl sm:max-w-3xl md:max-w-5xl border border-gray-300 rounded-md bg-white p-8 mt-16 shadow-sm">
        <div className="w-full max-w-sm sm:max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
              {/* simple 404 icon */}
              <svg
                className="w-10 h-10 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-black mb-2">404</h1>
          <p className="text-lg text-gray-600 mb-4">Page not found</p>

          <p className="text-sm text-gray-500 mb-6">
            The page you are looking for doesn't exist or has been moved. Try one of the options below.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto inline-block px-5 py-2 rounded-md bg-black text-white font-medium hover:opacity-95 transition"
            >
              Go to homepage
            </button>

            <Link
              href="/products"
              className="w-full sm:w-auto inline-block px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-center"
            >
              Browse courses
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Or check the URL for typos — <span className="text-gray-600">/course/my-course</span>
          </div>
        </div>
      </div>
    </div>
  );
}