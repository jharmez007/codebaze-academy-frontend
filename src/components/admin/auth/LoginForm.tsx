"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { successToast, errorToast } from "@/lib/toast";
import { login as loginService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext"; 

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, status, message } = await loginService({
        email: form.email,
        password: form.password,
      });

      if (status && status >= 200 && status < 300 && data) {
        login(data.user, data.access_token);

        localStorage.setItem("refresh_token", data.refresh_token);

        successToast("Login successful!");
        router.push("/admin/dashboard");
      } else {
        errorToast(message || "Invalid credentials");
      }
    } catch (err: any) {
      errorToast(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      {/* Password with visibility toggle */}
      <div className="relative">
        <Label>Password</Label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[32px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Forgot Password */}
      <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
        <a
          href="/admin-forgot-password"
          className="text-green-600 hover:underline"
        >
          Forgot your password?
        </a>
      </p>

      {/* Sign up link */}
      {/* <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
        Don’t have an account?{" "}
        <a href="/admin-signup" className="text-green-600 hover:underline">
          Sign Up
        </a>
      </p> */}
    </form>
  );
}
