"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { successToast, errorToast } from "@/lib/toast";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (
        form.email === "jamesagu2001@gmail.com" &&
        form.password === "1234"
      ) {
        successToast("Login successful!");
        router.push("/admin/dashboard");
      } else {
        errorToast("Invalid credentials");
      }
      setLoading(false);
    }, 800); // fake delay for UX
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </>

      {/* Password */}
      <>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Forgot Password */}
      <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
        <a href="/admin-forgot-password" className="text-green-600 hover:underline">
          Forgot your password?
        </a>
      </p>
    </form>
  );
}
