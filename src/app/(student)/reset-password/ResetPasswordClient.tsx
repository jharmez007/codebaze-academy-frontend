// /app/reset-password/ResetPasswordClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyResetToken, resetPassword } from "@/services/authService"; 

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize token and email from searchParams on mount
  useEffect(() => {
    const t = searchParams.get("token");
    const e = searchParams.get("email") ?? undefined;
    setToken(t);
    setEmail(e);
  }, [searchParams]);

  // Check token validity
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
  }, [token, email]);

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

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (expired) return <p className="text-center py-6 text-red-600">{error || "Link expired"}</p>;

  return (
    <div className="flex justify-center items-start min-h-[75vh] bg-white px-2">
      <div className="w-full max-w-xl sm:max-w-3xl md:max-w-5xl border border-gray-300 rounded-md bg-white p-4 sm:p-8 mt-6">
        <div className="w-full max-w-sm sm:max-w-lg mx-auto text-center">
          <h1 className="text-lg text-black font-semibold mb-8">Set a new password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">Password reset successful!</p>}
            <button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Submitting..." : "Set new password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
