"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import css from "../../../../../public/css-mastery.jpg"

export default function CssMasteryComingSoonPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="w-full py-12 md:py-20 bg-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-2/3">
            <div className="mb-2 text-[#00bf63] font-semibold text-lg">Coming Soon</div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              CSS Mastery
            </h1>
            <p className="text-gray-600 font-extralight text-lg">
              Learn modern CSS layout systems, animations, responsive design, UI patterns, and clean professional styling.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/" className="px-5 py-3 bg-white border border-gray-300 rounded-full text-gray-800 font-medium">
                Browse other courses
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-md bg-white">
              <Image src={css} alt="CSS Mastery" width={600} height={360} className="w-full h-48 object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl text-black font-bold mb-6">What to Expect</h2>

          <p className="text-gray-700 leading-relaxed text-lg font-extralight">
            CSS Mastery will walk you through Flexbox, Grid, animations, variables, responsive scaling, UI architecture, and advanced styling concepts used by real‑world front‑end developers.
          </p>

          <p className="mt-6 text-gray-600 font-light italic">
            This course will be available soon. Stay tuned for the official launch date.
          </p>
        </div>
      </div>
    </div>
  );
}
