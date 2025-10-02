"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseForm from "@/components/admin/courses/CourseForm";
import { getCourseById } from "@/services/courseService";

export default function EditCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No course ID provided.");
      setLoading(false);
      return;
    }

    getCourseById(Number(id)).then((res) => {
      if (res.data) {
        setCourse(res.data);
        console.log("course response", res.data)
      } else {
        setError(res.message || "Course not found");
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !course) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Course not found</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Course</h1>
      <CourseForm defaultValues={course} isEdit={true} id={id} />
    </div>
  );
}
