"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyResetToken, resetPassword } from "@/services/authService"; 

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? undefined;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check token validity on mount
  useEffect(() => {
  const checkToken = async () => {
    if (!token) {
      setExpired(true);
      setLoading(false);
      return;
    }

    try {
      const { status } = await verifyResetToken({ token, email });
      if (status !== 200) {
        setExpired(true);
        setError("Invalid or expired token.");
      }
    } catch (err: any) {
      setExpired(true);
      setError(err.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  checkToken();
}, [token, searchParams]);


  const canSubmit =
    password.length >= 6 && confirmPassword.length >= 6 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    try {
      setSubmitting(true);
      const { status, message } = await resetPassword({ token, password, email });

      if (status === 200) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(message || "Failed to reset password.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <p>Loading...</p>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="flex justify-center items-start min-h-[75vh] bg-white px-2">
        <div className="w-full max-w-4xl border border-gray-300 rounded-md bg-white p-6 mt-10 text-center">
          <h1 className="text-base sm:text-lg text-black font-semibold mb-4">
            Set a new password
          </h1>
          <p className="text-sm text-gray-600">
            {error || "Your reset link has expired. Please try again."}{" "}
            <a
              href="/forgot-password"
              className="underline text-gray-400 hover:text-gray-600 transition ease-in"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-[75vh] bg-white px-2">
      <div className="w-full max-w-xl sm:max-w-3xl md:max-w-5xl border border-gray-300 rounded-md bg-white p-4 sm:p-8 mt-6">
        <div className="w-full max-w-sm sm:max-w-lg mx-auto text-center">
          <h1 className="text-lg text-black font-semibold mb-8">
            Set a new password
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-left">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
              />
              <p className="text-xs text-gray-600 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div className="mb-6 text-left">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-4">
                Password reset successful! Redirecting to login...
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={`w-full rounded-md py-2 text-white font-semibold transition ${
                canSubmit && !submitting
                  ? "bg-black hover:bg-gray-800 cursor-pointer"
                  : "bg-gray-400"
              }`}
            >
              {submitting ? "Submitting..." : "Set new password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
