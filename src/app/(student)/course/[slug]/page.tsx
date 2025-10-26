"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data/courses";
import { Breadcrumb } from "../../../../components";
import { Sidebar } from "../../../../components";
import Link from "next/link";
import { useFullscreen } from "../../../../context/FullscreenContext";
import { SquarePlay } from "lucide-react";

const CoursePage = () => {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);
  const { fullscreen } = useFullscreen();

  if (!course) return <p>Course not found</p>;

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar course={course} fullscreen={fullscreen} />

      <main className="flex-1 p-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course" },
          ]}
        />

        <h1 className="text-2xl font-bold mb-6">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.longDescription}</p>

        <div className="space-y-6">
          {course.sections.map((section) => {
            const lessonCount = section.lessons.length;
            const lessonLabel = lessonCount === 1 ? "Lesson" : "Lessons";

            return (
              <div
                key={section.slug}
                className="border border-gray-300 rounded-lg p-4"
              >
                {/* Section header (clickable link) */}
                <Link
                  href={`/course/${course.slug}/section/${section.slug}`}
                  className="font-semibold text-lg px-2 text-gray-900 hover:underline"
                >
                  {section.section}
                </Link>

                {section.description && (
                  <p className="text-gray-500 mt-1 px-2 mb-6">
                    {section.description}
                  </p>
                )}

                <p className="text-black font-medium px-2 mt-1 mb-6">
                  {lessonCount} {lessonLabel}
                </p>


                <ul className="mt-3 space-y-1">
                  {section.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition font-medium"
                      >
                        <SquarePlay className="w-4 h-4 text-gray-600" />
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
