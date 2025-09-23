// src/app/(admin)/courses/new/page.tsx
import CourseForm from "@/components/admin/courses/CourseForm";

export default function AddCoursePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Course</h1>
      <CourseForm />
    </div>
  );
}
