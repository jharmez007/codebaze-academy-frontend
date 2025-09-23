"use client";
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses } from "@/data/courses";
import { useState } from "react";

const MOCK_EXISTING_EMAIL = "existing@user.com";

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const course = courses.find((c) => c.slug === slug);

  // Auth states
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Email verification states
  const [showVerify, setShowVerify] = useState(false);
  const [verify, setVerify] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifySent, setVerifySent] = useState(false);

  if (!course) return notFound();

  // Mock: If user is already logged in
  const isLoggedIn = false; // Change to true to test logged-in state

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLoginError("");
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MOCK_EXISTING_EMAIL) {
      setShowPassword(true);
    } else {
      setLoggedIn(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "password123") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Try 'password123'.");
    }
  };

  const handleVerifyClick = () => {
    setShowVerify(true);
    setShowPassword(false);
    setVerify("");
    setVerifyError("");
    setVerifySent(true);
  };

  const handleVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerify(e.target.value);
    setVerifyError("");
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Accept "0987" as the correct code
    if (verify === "0987") {
      setLoggedIn(true);
      setVerifyError("");
    } else {
      setVerifyError("Invalid verification code. Try '0987'.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 text-black px-6">
      <h1 className="text-xl md:text-2xl font-bold mb-8 text-center">Checkout</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="border border-gray-300 rounded-lg p-6">
            {/* Email Verification */}
            {showVerify ? (
              <>
                <h2 className="text-lg font-semibold mb-1">Verify account</h2>
                  <div>
                    <p className="mb-2 font-medium text-gray-500 text-sm">
                      We sent a verification code to {email}{" "}
                      <button
                        type="button"
                        className="underline transition hover:text-gray-700 ease-in cursor-pointer ml-1"
                        onClick={() => setVerifySent(false)}
                      >
                        Try again
                      </button>
                    </p>
                  </div>
                
                  <form className="mt-5" onSubmit={handleVerifySubmit}>
                    <label className="block text-sm font-medium text-black mb-2">
                      Verification code
                    </label>
                    <input
                      type="text"
                      required
                      value={verify}
                      onChange={handleVerifyChange}
                      placeholder="e.g. 0987"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition placeholder:text-gray-400"
                    />
                    {verifyError && (
                      <p className="text-red-500 text-xs mt-2">{verifyError}</p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className={`mt-4 px-3 py-1 font-medium rounded-md text-white transition ${
                          verify.length > 0
                            ? "bg-black hover:bg-gray-800 cursor-pointer"
                            : "bg-gray-400"
                        }`}
                        disabled={verify.length === 0}
                      >
                        Verify
                      </button>
                    </div>
                  </form>
                
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-1">Contact info</h2>
                {isLoggedIn || loggedIn ? (
                  <div>
                    <p className="mb-2 font-medium text-gray-400 text-sm">
                      {email || "user@domain.com"}
                    </p>
                  </div>
                ) : (
                  <>
                    {!showPassword && (
                      <form className="mt-4" onSubmit={handleContinue}>
                        <label className="block text-sm font-medium text-black mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="e.g. picard@starfleet.org"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition placeholder:text-gray-400"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className={`mt-4 px-3 py-1 font-medium rounded-md text-white transition ${
                              isEmailValid
                                ? "bg-black hover:bg-gray-800 cursor-pointer"
                                : "bg-gray-400"
                            }`}
                            disabled={!isEmailValid}
                            title="Please input a valid email"
                          >
                            Continue
                          </button>
                        </div>
                      </form>
                    )}
                    {showPassword && (
                      <form onSubmit={handleLogin}>
                        <label className="block text-sm text-black mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500"
                        />
                        <label className="block text-sm text-black mb-2 mt-4">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition placeholder:text-gray-400"
                        />
                        <p className="text-xs mt-1 text-gray-500">
                          Forgot your password?{" "}
                          <button
                            type="button"
                            className="underline text-gray-500 transition hover:text-gray-700 ease-in cursor-pointer"
                            onClick={handleVerifyClick}
                          >
                            Verify your email
                          </button>
                        </p>
                        {loginError && (
                          <p className="text-red-500 text-xs mt-2">{loginError}</p>
                        )}
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className={`mt-4 px-3 py-1 font-medium rounded-md text-white transition ${
                              password.length > 0
                                ? "bg-black hover:bg-gray-800 cursor-pointer"
                                : "bg-gray-400"
                            }`}
                            disabled={password.length === 0}
                            title="please input password"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="border border-gray-300 rounded-lg p-6">
          {/* Course Summary */}
          <div className="flex items-start space-x-4 mb-4">
            <Image
              src={course.image}
              alt={course.title}
              width={84}
              height={84}
              className="rounded-md border border-gray-300 h-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Course</p>
              <p className="font-semibold text-gray-900">{course.title}</p>
              <p className="text-sm text-gray-600">${course.price}</p>
            </div>
          </div>

          {/* Discount */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Discount code"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
            />
            <button className="px-4 py-2 text-gray-500 border text-sm border-gray-300 rounded-md hover:bg-gray-200 transition cursor-pointer">
              Apply
            </button>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${course.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span>${course.price}</span>
            </div>
          </div>

          {/* Due now */}
          <div className="mt-4 flex justify-between items-center text-sm font-semibold">
            <span>Due now</span>
            <span className="text-gray-900">
              <span className="bg-gray-200 font-extralight p-1 rounded-md">USD</span>{" "}
              ${course.price}
            </span>
          </div>

          {/* Pay Button */}
          {(isLoggedIn || loggedIn) ? (
            <button
              className="w-full mt-4 py-3 font-medium rounded-md bg-gray-400 text-white hover:bg-gray-500 transition cursor-pointer"
            >
              Pay now
            </button>
          ) : (
            <button
              className="w-full mt-4 py-3 font-medium rounded-md bg-gray-300 text-gray-500"
              tabIndex={-1}
              title="Please log in to continue"
              onClick={e => e.preventDefault()}
              type="button"
            >
              Pay now
            </button>
          )}

          {/* Terms */}
          <p className="mt-3 text-xs text-gray-500">
            By clicking "Pay now" you agree to the{" "}
            <a href="#" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
