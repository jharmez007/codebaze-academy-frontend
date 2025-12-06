"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { verifyToken, sendVerificationOTP } from "@/services/authService";

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      errorToast("Please enter the OTP");
      return;
    }
    setLoading(true);
    const { status, message } = await verifyToken({ email, token: otp });
    setLoading(false);

    if (status && status >= 200 && status < 300) {
      successToast("Email verified successfully!");
      router.push("/admin-login");
    } else {
      errorToast(message || "Invalid or expired OTP");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    const { status, message } = await sendVerificationOTP({ email });
    if (status && status >= 200 && status < 300) {
      successToast("New OTP sent to your email");
      setCooldown(60);
    } else {
      errorToast(message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Verify Your Email
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        <Input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center tracking-widest mb-4"
        />

        <Button onClick={handleVerify} disabled={loading} className="w-full mb-3">
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">Resend OTP in {cooldown}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-green-600 hover:underline font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ⬅ Wrap the component in Suspense (fix useSearchParams)
export default function VerifyEmailWrapper() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailPage />
    </Suspense>
  );
}
