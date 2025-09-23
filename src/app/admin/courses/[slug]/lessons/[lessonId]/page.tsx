// src/app/admin/courses/[slug]/lessons/[lessonId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { courses } from "@/data/courses";
import LessonEditor from "@/components/admin/courses/LessonEditor";

export default function LessonPage() {
  const { slug, lessonId } = useParams();

  // Get course
  const course = courses.find((c) => c.slug === slug);

  // Flatten sections into a single lessons array
  const lesson =
    course?.sections.flatMap((s) => s.lessons).find((l) => l.slug === lessonId);

  const [currentLesson, setCurrentLesson] = useState(lesson);

  if (!currentLesson) {
    return <p className="p-6">Lesson not found</p>;
  }

  const handleSave = (updatedLesson: any) => {
    setCurrentLesson(updatedLesson);
    console.log("Updated lesson:", updatedLesson);
    // Later: send to backend API (PUT /api/lessons/:id)
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LessonEditor lesson={currentLesson} onSave={handleSave} />
    </div>
  );
}
