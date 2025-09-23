"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      errorToast("Please enter your email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      successToast("Password reset link sent to your email!");
      setLoading(false);
      setEmail("");
    }, 1000); // Fake delay for UX
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
            <a href="/admin-login" className="text-green-600 hover:underline">
              Back to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
