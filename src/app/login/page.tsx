"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canLogin = isEmailValid && password.length > 0;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add authentication logic here
    router.push("/products");
  };

  return (
    <div className="flex justify-center items-start min-h-[75vh] bg-white px-2">
      <div className="w-full max-w-xl sm:max-w-3xl md:max-w-5xl border border-gray-300 rounded-md bg-white p-4 sm:p-8 mt-6">
        <div className="w-full max-w-sm sm:max-w-lg mx-auto text-center">
          {/* Title */}
          <h1 className="text-lg text-black font-semibold mb-8">
            Log in to CodeBaze Academy
          </h1>

          <form onSubmit={handleLogin}>
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6 text-left">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
              />
            </div>

            {/* Login Button */}
            <button
              className={`w-full rounded-md py-2 text-white font-semibold transition ${
                canLogin
                  ? "bg-black cursor-pointer"
                  : "bg-gray-400"
              }`}
              disabled={!canLogin}
              type="submit"
            >
              Login
            </button>
          </form>

          {/* Forgot Password */}
          <p className="mt-4 text-sm text-gray-600">
            Forgot your password?{" "}
            <Link href="/reset-password" className="underline">
              Reset it.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
