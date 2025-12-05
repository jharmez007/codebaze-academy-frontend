"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { resetPassword, verifyResetToken } from "@/services/authService";

export default function AdminResetPasswordForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      errorToast("Password must be at least 8 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      errorToast("Passwords do not match");
      return;
    }

    if (!token || !email) {
      errorToast("Invalid password reset link");
      return;
    }

    setLoading(true);
    try {
      const { status } = await resetPassword({
        token,
        email,
        password: form.password,
      });

      if (status === 200) {
        successToast("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/admin-login"), 2000);
      } else {
        errorToast("Unable to reset password");
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
        <p className="text-gray-500">Validating link...</p>
      </div>
    );
  }

  if (isValidLink === false) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-semibold mb-3">Reset Link Expired</h1>
        <p className="text-gray-500 mb-6">
          Your password reset link is invalid or has expired.
        </p>
        <Button onClick={() => router.push("/admin-forgot-password")} className="w-full max-w-sm">
          Request New Link
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center mb-2">Reset Password</h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password to access your account.
        </p>

        <div>
          <Label>New Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div>
          <Label>Confirm Password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <p className="text-sm text-center mt-3 text-gray-500">
          Remember your password?{" "}
          <a href="/admin-login" className="text-green-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
