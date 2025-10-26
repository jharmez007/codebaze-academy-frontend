"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For app router
import Link from "next/link";
import { getCourses, Course } from "../../../../services/studentCourseService";

export default function ThankyouPage() {
  const params = useParams(); // Get slug from URL
  const { slug } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      const res = await getCourses();
      if (res.data) {
        const foundCourse = res.data.find((c) => c.slug === slug);
        setCourse(foundCourse || null);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[75vh]">
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[75vh]">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center py-12 justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#111] mb-3">Thank you!</h1>
        <p className="text-[18px] text-gray-700 mb-8">
          You've now got access to{" "}
          <span className="font-medium text-[#111]">{course.title}</span>
        </p>
        <Link
          href="/products"
          className="max-sm:hidden bg-[#00bf63] font-bold text-white md:ml-8 px-8 py-4 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          View product
        </Link>
      </div>
    </div>
  );
}
