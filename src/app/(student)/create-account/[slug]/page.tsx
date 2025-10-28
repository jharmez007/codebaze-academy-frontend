"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCourses, Course } from "../../../../services/studentCourseService";
import { createPassword } from "../../../../services/authService";
import { useAuth } from "@/context/AuthContext";
import { infoToast } from "@/lib/toast";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();

  const router = useRouter();
  const params = useParams(); // get slug from URL
  const slug = params.slug;

  // Validation
  const canSubmit = password.length > 6 && name.trim().length > 0;

  // Fetch course matching slug
  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      const res = await getCourses();
      if (res.data) {
        const matchedCourse = res.data.find((c) => c.slug === slug);
        setCourse(matchedCourse || null);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !course) return;

    if (!token) {
      infoToast("You must verify your email first.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Pass token in headers
      const res = await createPassword(
        { password, full_name:name }, // include name if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        // Redirect to thank you page
        router.push(`/thankyou/${course.slug}`);
      } else {
        setError(res.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[75vh]">
        <p>No courses available</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-[75vh] bg-white px-2">
      <div className="w-full max-w-xl sm:max-w-3xl md:max-w-5xl border border-gray-300 rounded-md bg-white p-4 sm:p-8 mt-6">
        <div className="w-full max-w-sm sm:max-w-lg mx-auto text-center">
          <h1 className="text-lg text-black font-semibold mb-8">
            Finish creating account
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4 text-left">
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="mb-6 text-left">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition"
              />
              <p>Minimum 6 characters</p>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Submit Button */}
            <button
              className={`w-full rounded-md py-2 text-white font-semibold transition ${
                canSubmit && !submitting ? "bg-black cursor-pointer" : "bg-gray-400"
              }`}
              disabled={!canSubmit || submitting}
              type="submit"
            >
              {submitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
