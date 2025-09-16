"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canLogin = isEmailValid;

  return (
    <div className="flex justify-center items-start min-h-[75vh] bg-white px-2">
      <div className="w-full max-w-xl sm:max-w-3xl md:max-w-5xl border border-gray-300 rounded-md bg-white p-4 sm:p-8 mt-6">
        <div className="w-full max-w-sm sm:max-w-lg mx-auto text-center">
          {/* Title */}
          <h1 className="text-lg text-black font-semibold mb-3">
            Reset password
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            We'll send you password reset instructions.
          </p>

          {/* Email */}
          <div className="mb-4 text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="e.g. picard@starfleet.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-black text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            className={`w-full rounded-md py-2 text-white font-semibold transition ${
              canLogin
                ? "bg-black cursor-pointer"
                : "bg-gray-400"
            }`}
            disabled={!canLogin}
          >
            Send reset email
          </button>

          {/* Remember Password */}
          <p className="mt-4 text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="underline">
              Login.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
