"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "../../../../../../../../components";
import { Sidebar } from "../../../../../../../../components";
import { Comments } from "../../../../../../../../components";
import { courses } from "@/data/courses";
import { useFullscreen } from "../../../../../../../../context/FullscreenContext";

const LessonPage = () => {
  const { slug, sectionSlug, lessonSlug } = useParams();

  const course = courses.find((c) => c.slug === slug);
  const section = course?.sections.find((s) => s.slug === sectionSlug);
  const lesson = section?.lessons.find((l) => l.slug === lessonSlug);

  const [completed, setCompleted] = useState(false);
  const { fullscreen } = useFullscreen();

  if (!course || !section || !lesson) return <p>Lesson not found</p>;

  return (
    <div className="flex min-h-screen">
      {!fullscreen && (
        <Sidebar course={course} activeSection={section.slug} activeLesson={lesson.slug} />
      )}

      <main className={`flex-1 p-6 transition-all ${fullscreen ? "max-w-4xl mx-auto" : ""}`}>
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course", href: `/course/${course.slug}` },
            { label: section.section, href: `/course/${course.slug}/section/${section.slug}` },
            { label: lesson.title },
          ]}
        />

        {/* Video player */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <div className="aspect-video flex items-center justify-center text-white">
            {lesson.title}
          </div>
        </div>

        <p className="text-gray-700 mb-4">
          {lesson.title} — {lesson.duration} ({lesson.size})
        </p>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-6">
          <button className="px-3 py-1 border rounded">← Prev</button>
          <button
            onClick={() => setCompleted(!completed)}
            className={`px-4 py-2 rounded ${completed ? "bg-green-600 text-white" : "border"}`}
          >
            {completed ? "Completed" : "Complete"}
          </button>
          <button className="px-3 py-1 border rounded">Next →</button>
        </div>

        {/* Comments */}
        <Comments />
      </main>
    </div>
  );
};

export default LessonPage;
