"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { successToast, errorToast } from "@/lib/toast";
import { login as loginService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canLogin = isEmailValid && password.length > 0;

   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const { data, status, message } = await loginService({
          email,
          password,
        });
  
        if (status && status >= 200 && status < 300 && data) {
          login(data.user, data.access_token);

          localStorage.setItem("refresh_token", data.refresh_token);

          successToast("Login successful!");
          router.push("/products");
        } else {
          errorToast(message || "Invalid credentials");
        }
      } catch (err: any) {
        errorToast(err.message || "Something went wrong");
      }
    };

  return (
    <div className="flex justify-center items-start bg-white px-2">
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-black text-base outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition placeholder:text-gray-400"
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-black text-base outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
            <Link href="/forgot-password" className="underline">
              Reset it.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
