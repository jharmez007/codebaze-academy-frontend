"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { successToast, errorToast } from "@/lib/toast";
import CoursesTable from "@/components/admin/courses/CoursesTable";
import { courses } from "@/data/courses";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "1") {
      successToast("Course created successfully!");
      router.replace("/admin/courses"); 
    }

    if (error === "1") {
      errorToast("Failed to save course. Please try again.");
      router.replace("/admin/courses"); 
    }
  }, [searchParams, router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <a
          href="/admin/courses/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Course
        </a>
      </div>
      <CoursesTable data={courses} />
    </div>
  );
}
