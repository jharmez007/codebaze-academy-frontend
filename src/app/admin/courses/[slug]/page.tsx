"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data/courses";
import CourseForm from "@/components/admin/courses/CourseForm";

export default function EditCoursePage() {
  const { slug } = useParams();
  if (!slug) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Course not found</h1>
        <p>No course slug provided.</p>
      </div>
    );
  }

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Course not found</h1>
        <p>The course you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Course</h1>
      <CourseForm defaultValues={course} isEdit={true} />
    </div>
  );
}
