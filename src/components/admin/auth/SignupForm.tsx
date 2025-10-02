"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { successToast, errorToast } from "@/lib/toast";
import { register } from "@/services/authService";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Validation rules
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Name: at least 2 chars, alphabets and spaces only
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(form.name)) {
      newErrors.name = "Name should be at least 2 letters, no special characters";
    }

    // Email: simple RFC2822 compliant check
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

   // Password: 6+ chars, must contain letters and numbers
    // if (!form.password) {
    // newErrors.password = "Password is required";
    // } else if (
    // !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(form.password)
    // ) {
    // newErrors.password =
    //     "Password must be at least 6 characters and include letters and numbers";
    // }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, status, message } = await register({
        full_name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });

      if ((status === 200 || status === 201) && data) {
        successToast("Account created successfully!");
        router.push("/admin-login");
        } else {
        errorToast(message || "Failed to create account");
        }

    } catch (err: any) {
      errorToast(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

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
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Create password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <a href="/admin-login" className="text-green-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
} 