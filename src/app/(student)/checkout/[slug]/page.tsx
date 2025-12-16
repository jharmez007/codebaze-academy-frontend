"use client";
import React from "react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { successToast, errorToast, infoToast } from "@/lib/toast";

import { getCourses, getCourseById, Course } from "@/services/studentCourseService";
import { enroll, enrollRequest } from "@/services/enrollmentService";
import { login as loginService, verifyToken, forgotPassword } from "@/services/authService";
import { initializePayment } from "@/services/paymentService";
import { validatePromo } from "@/services/couponService";

import { normalizeImagePath } from "@/utils/normalizeImagePath";
import { useAuth } from "@/context/AuthContext";


export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth states
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Email verification states
  const [showVerify, setShowVerify] = useState(false);
  const [verify, setVerify] = useState("");
  const [verifyError, setVerifyError] = useState("");

  //Coupon states
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<any>(null);

  const { user, token, isAuthenticated, logout, login } = useAuth();

  const router = useRouter();

   useEffect(() => {
    const fetchCourse = async () => {
      const startTime = Date.now();

      try {
        // 1️⃣ Get all courses
        const { data: allCourses } = await getCourses({
        headers: { "X-Dev-IP": "197.211.53.241" },
      });

        // 2️⃣ Find the course by slug
        const matchedCourse = allCourses?.find((c) => c.slug === slug);
        if (!matchedCourse) {
          notFound();
        }

        // 3️⃣ Fetch full details by ID
        const { data: fullCourse } = await getCourseById(matchedCourse.id, {
        headers: { "X-Dev-IP": "197.211.53.241" },
      });
        setCourse(fullCourse || matchedCourse);
      } catch (err) {
        console.error("Error loading course:", err);
        notFound();
      } finally {
        // 🕒 Ensure loading lasts at least 1 second
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1000 - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      }
    };

    fetchCourse();
  }, [slug]);


    // Early loading skeleton
  if (loading) {
    return (
      <div className="bg-white flex justify-center items-center py-12 px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          {/* Left section skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>

              {/* Email input skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="flex justify-end">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right section skeleton */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Course Summary */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>

            {/* Discount */}
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="w-20 h-10 bg-gray-200 rounded"></div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>

            {/* Due now */}
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Pay button */}
            <div className="h-10 bg-gray-200 rounded mt-4"></div>

            {/* Terms */}
            <div className="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
        </div>
      </div>
    );
  }


  if (!course) return notFound();


  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLoginError("");
  };

  const handleContinue = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const result = await enrollRequest({ email });

    if (result.status === 200) {
      setPassword("");
      setShowPassword(true);
      setLoginError("");
    } else if (result.status === 201) {
      handleVerifyClick();
    } else {
      errorToast(`Enrollment request failed: ${result.message || "Unknown error"}`);
    }
  } catch (error) {
    errorToast(`Something went wrong: ${(error as Error).message}`);
  }
};


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, status, message } = await loginService({
        email,
        password,
      });
      
      if (status && status >= 200 && status < 300 && data) {
        login(data.user, data.access_token);
        window.location.reload();
          
          localStorage.setItem("refresh_token", data.refresh_token);
          setLoginError("");
          successToast("Login successful!");
        } else {
          errorToast(message || "Invalid credentials");
        }
      } catch (err: any) {
        errorToast(err.message || "Something went wrong");
      }
  };

  const handleVerifyClick = () => {
    setShowVerify(true);
    setShowPassword(false);
    setVerify("");
    setVerifyError("");
  };

  const handleVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerify(e.target.value);
    setVerifyError("");
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await verifyToken({
      email,
      token: verify, // or token: verify depending on your API
    });
    
    if (result.status === 200 || result.status === 201) {
      if (!result.user || !result.access_token) {
        setVerifyError("Verification failed. No user or token returned.");
        return;
      }
      
    window.location.reload();
    setShowVerify(false);
    setVerifyError("");

    login(result.user, result.access_token);

      successToast("Email verified successfully!");
    } else {
      setVerifyError(result.message || "Verification failed. Please try again.");
    }
  } catch (error) {
    setVerifyError((error as Error).message);
  }
};


const handleEnroll = async () => {
  if (!token) {
    infoToast("You must verify your email first.");
    return;
  }

  const payload = {
    email: user?.email,
    amount: course.price,
    coupon_code: code,
  };

  try {
    // CASE 1: Free course or already paid → enroll directly
    if (course.price === 0 || course.is_paid) {
      const result = await enroll(course.id, payload, {
        headers: { Authorization: `Bearer ${token!}` },
      });

      if (result.status === 200 || result.status === 201) {
        successToast(`Enrolled in ${course.title}!`);
        if (result.full_name === "Guest User" && result.has_password === false) {
          router.push(`/create-account/${course.slug}`);
        } else {
          router.push("/products");
        }
      } else {
        errorToast(`Enrollment failed: ${result.message || "Unknown error"}`);
      }
    } 
    // CASE 2: Paid course and not yet paid → initialize payment
    else {
      const paymentResult = await initializePayment(course.id.toString(), payload, {
        headers: { Authorization: `Bearer ${token!}`},
      });

      if (paymentResult.status === 200 && paymentResult.authorization_url) {
        router.push(paymentResult.authorization_url);
      } else {
        errorToast(`Payment initialization failed: ${paymentResult.message || "Unknown error"}`);
      }
    }
  } catch (error) {
    errorToast(`Something went wrong: ${(error as Error).message}`);
  }
};




const handleResetPassword = async () => {
  if (!email) {
    infoToast("Please enter your email address.");
    return;
  }

  try {
    const result = await forgotPassword({ email });

    if (result.status === 200) {
      successToast
      
      
      ("Password reset link sent to your email.");
    } else {
      errorToast(result.message || "Failed to send reset link.");
    }
  } catch (error) {
    errorToast("An unexpected error occurred. Please try again.");
  }
};

const handleApply = async () => {
    if (!code.trim()) {
      errorToast("Please enter a discount code");
      return;
    }

    const { data, message, status } = await validatePromo({
      course_id: course.id,
      code,
    }, {
        headers: { "X-Dev-IP": "197.211.53.241" },
      }
    );

    if (status === 200) {
      setDiscount(data);
      successToast(data?.message || "Coupon applied successfully!");
    } else {
      errorToast(message || "Invalid or expired coupon");
      setDiscount(null);
    }
  };

const handleLogout = () => {
    logout();
    setShowPassword(false);
    setPassword("");
    setEmail("");
  };

  return (
    <div className="bg-white py-12 text-black px-6">
      <h1 className="text-xl md:text-2xl font-bold mb-8 text-center">Sign Up</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        onClick={handleContinue}
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
                {isAuthenticated  ? (
                  <div className="flex relative justify-between">
                    <p className="mb-2 font-medium text-gray-400 text-sm">
                      {user?.email || "user@domain.com"}
                    </p>
                    <button 
                      onClick={handleLogout}
                      className="absolute right-0 top-[-20px] font-medium self-start text-gray-500 hover:text-black hover:bg-gray-200 py-1 px-3 rounded-md cursor-pointer transition "
                    >
                        Logout
                    </button>
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
                            onClick={handleResetPassword}
                          >
                            Reset it
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
            <img
              src={normalizeImagePath(course.image as any)}
              alt={course.title}
              width={84}
              height={84}
              className="rounded-md border border-gray-300 h-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Course</p>
              <p className="font-semibold text-gray-900">{course.title}</p>
              <p className="text-sm text-gray-600">
                {course.price === 0
                  ? "Free"
                  : `${course.currency === "USD" ? "$" : "₦"}${course.price.toLocaleString()}`}
              </p>
            </div>
          </div>

         {(course.price > 0 && !course.is_paid) && (
              <>
                {/* Discount */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
                  />
                  <button
                    onClick={handleApply}
                    disabled={loading}
                    className={`px-4 py-2 text-sm border rounded-md transition cursor-pointer ${
                      loading
                        ? "text-gray-400 bg-gray-100"
                        : "text-gray-500 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {loading ? "Checking..." : "Apply"}
                  </button>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      {course.price === 0
                        ? 0
                        : `${course.currency === "USD" ? "$" : "₦"}${(discount ? discount.original_price.toLocaleString() : course.price.toLocaleString())}`}
                    </span> 
                  </div>

                  {discount && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-gray-600">Discount ({discount.code})</span>
                      <span>-{`${course.currency === "USD" ? "$" : "₦"}${discount.discount}`}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-800">Total</span>
                    <span>
                       {course.price === 0
                        ? 0
                        : `${course.currency === "USD" ? "$" : "₦"}${(discount ? discount.final_price.toLocaleString() : course.price.toLocaleString())}`}
                    </span>
                  </div>
                </div>

                {/* Due now */}
                <div className="mt-4 flex justify-between items-center text-sm font-semibold">
                  <span>Due now</span>
                  <span className="text-gray-900">
                     <span className="bg-gray-200 font-extralight p-1 rounded-md mr-1">
                      {course?.currency}
                    </span>
                   {course.price === 0
                        ? 0
                        : `${course.currency === "USD" ? "$" : "₦"}${(discount ? discount.final_price.toLocaleString() : course.price.toLocaleString())}`}
                  </span>
                </div>
              </>
            )}


          {/* Pay / Enroll Button */}
          {isAuthenticated ? (
            <button
              onClick={!course.is_enrolled ? handleEnroll : undefined}
              disabled={course.is_enrolled}
              className={`w-full mt-4 py-3 font-medium rounded-md text-white transition cursor-pointer ${
                course.is_enrolled
                  ? "bg-gray-300" // Already enrolled
                  : course.price === 0 || course.is_paid
                  ? "bg-green-600 hover:bg-green-700" // Free or paid → Enroll
                  : "bg-gray-400 hover:bg-gray-500" // Not paid → Get now
              }`}
            >
              {course.is_enrolled
                ? "Enrolled"
                : course.price === 0 || course.is_paid
                ? "Enroll"
                : "Get now"}
            </button>
          ) : (
            <button
              className="w-full mt-4 py-3 font-medium rounded-md bg-gray-300 text-gray-500"
              title="Please log in to continue"
              onClick={(e) => e.preventDefault()}
              type="button"
            >
              Get now
            </button>
          )}



         {/* Terms */}
          <p className="mt-3 text-xs text-gray-500">
            By clicking{" "}
            <span className="font-medium">
              "{course.price === 0 || course.is_paid ? "Enroll" : "Get now"}"
            </span>{" "}
            you agree to the{" "}
            <a href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
