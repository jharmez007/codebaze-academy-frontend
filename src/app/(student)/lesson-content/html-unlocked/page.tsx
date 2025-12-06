"use client";

import Image from "next/image";
import Link from "next/link";

import html from "../../../../../public/html-unlocked.jpg"

export default function HtmlUnlockedComingSoonPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full py-12 md:py-20 bg-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-2/3">
            <div className="mb-2 text-[#00bf63] font-semibold text-lg">Coming Soon</div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              HTML Unlocked
            </h1>
            <p className="text-gray-600 font-extralight text-lg">
              Master the fundamentals of HTML and learn how to structure clean, semantic, accessible webpages.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/" className="px-5 py-3 bg-white border border-gray-300 rounded-full text-gray-800 font-medium">
                Browse other courses
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-md bg-white">
              <Image src={html} alt="HTML Unlocked" width={600} height={360} className="w-full h-48 object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl text-black font-bold mb-6">What to Expect</h2>

          <p className="text-gray-700 leading-relaxed text-lg font-extralight">
            HTML Unlocked is a beginner‑friendly course designed to teach you the structure of the web. Learn HTML tags, semantic layouts, accessibility principles, forms, SEO‑friendly markup, and how to build real‑world page structures.
          </p>

          <p className="mt-6 text-gray-600 font-light italic">
            This course will be available soon. Check back later or follow us on social media for updates.
          </p>
        </div>
      </div>
    </div>
  );
}

