"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { resetPassword, verifyResetToken } from "@/services/authService";

function AdminResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? undefined;

  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const validateLink = async () => {
      if (!token || !email) {
        setIsValidLink(false);
        return;
      }

      try {
        const { status } = await verifyResetToken({ token, email });
        setIsValidLink(status === 200);
      } catch {
        setIsValidLink(false);
      }
    };

    validateLink();
  }, [token, email]);

  const passwordValid =
    form.password.length >= 6 &&
    /[a-z]/.test(form.password) &&
    /[A-Z]/.test(form.password);

  const canSubmit =
    passwordValid &&
    form.confirmPassword.length >= 6 &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      errorToast("Invalid password reset link");
      return;
    }

    if (form.password !== form.confirmPassword) {
      errorToast("Passwords do not match");
      return;
    }

    if (!passwordValid) {
      errorToast(
        "Password must be at least 6 characters and include both lower and upper case letters."
      );
      return;
    }

    setLoading(true);
    try {
      const { status, message } = await resetPassword({
        token,
        email,
        password: form.password,
      });

      if (status === 200) {
        successToast("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/admin-login"), 2000);
      } else {
        errorToast(message || "Unable to reset password");
      }
    } catch (err: any) {
      errorToast(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isValidLink === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Validating link...</p>
      </div>
    );
  }

  if (isValidLink === false) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Reset Link Expired
        </h1>
        <p className="text-gray-500 mb-6 dark:text-gray-400">
          Your password reset link is invalid or has expired.
        </p>
        <Button
          onClick={() => router.push("/admin-forgot-password")}
          className="w-full max-w-sm"
        >
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center mb-2 dark:text-white">
          Reset Password
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
          Enter your new password to access your account.
        </p>

        {/* New Password */}
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Minimum 6 characters. Include both lower and upper case letters.
            {!passwordValid && form.password.length > 0 && (
              <span className="text-red-500"> — requirement not met</span>
            )}
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-sm text-red-500 mt-2">Passwords do not match</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading || !canSubmit}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <a href="/admin-login" className="text-green-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

// ✅ Apply Suspense fix (same file)
export default function AdminResetPasswordWrapper() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
        </div>
      }
    >
      <AdminResetPasswordPage />
    </Suspense>
  );
}
