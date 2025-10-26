"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data/courses";
import { Breadcrumb } from "../../../../../../components";
import { Sidebar } from "../../../../../../components";
import Link from "next/link";
import { useFullscreen } from "../../../../../../context/FullscreenContext";
import { SquarePlay, ArrowLeft, ArrowRight } from "lucide-react";

const SectionPage = () => {
  const { slug, sectionSlug, lessonSlug } = useParams();

  // find course by slug
  const course = courses.find((c) => c.slug === slug);

  // find section by slug
  const sectionIndex = course?.sections.findIndex(
    (s) => s.slug === sectionSlug
  );
  const section = sectionIndex !== undefined ? course?.sections[sectionIndex] : undefined;

  if (!course || !section) return <p>Section not found</p>;

  // find current lesson index
  const currentLessonIndex = lessonSlug
    ? section.lessons.findIndex((l) => l.slug === lessonSlug)
    : 0;
  const currentLesson = currentLessonIndex !== -1 ? section.lessons[currentLessonIndex] : section.lessons[0];

  const { fullscreen } = useFullscreen();

  // SEAMLESS BACKWARDS NAVIGATION
  const prevHref = sectionIndex! > 0 
    ? `/course/${course.slug}/section/${course.sections[sectionIndex! - 1].slug}/lesson/${course.sections[sectionIndex! - 1].lessons.slice(-1)[0].slug}`
    : "#";

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar
        course={course}
        activeSection={section.slug}
        fullscreen={fullscreen}
      />

      <main className="flex-1 p-6 relative">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course", href: `/course/${course.slug}` },
            { label: "Section" },
          ]}
        />

        <h1 className="text-xl font-bold mb-6">{section.section}</h1>
        {section.description && (
          <p className="text-gray-600 mb-6">{section.description}</p>
        )}

        {/* Lessons container */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <p className="text-black font-medium px-2 mt-1 mb-6">
            {section.lessons.length}{" "}
            {section.lessons.length === 1 ? "Lesson" : "Lessons"}
          </p>

          <ul className="space-y-2">
            {section.lessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                  className="flex items-center gap-2 text-gray-700 px-2 py-1 rounded transition font-medium hover:bg-gray-100"
                >
                  <SquarePlay className="w-4 h-4 text-gray-600" />
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PERFECT SEAMLESS NAVIGATION BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          {/* Previous: Section 2 → Section 1 Lesson LAST | Section 1 → Disabled */}
          <Link
            href={prevHref}
            title={
              sectionIndex! > 0 ? "Previous Section's Last Lesson" : "No previous content"
            }
            className={`p-3 text-xs border rounded-md flex items-center gap-1 ${
              sectionIndex! > 0
                ? "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                : "text-gray-400 opacity-50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Next: First Lesson of CURRENT Section (ALWAYS) */}
          <Link
            href={
              section.lessons.length > 0
                ? `/course/${course.slug}/section/${section.slug}/lesson/${section.lessons[0].slug}`
                : "#"
            }
            title={section.lessons.length > 0 ? "First Lesson" : "No lessons"}
            className={`p-3 text-xs border rounded-md flex items-center gap-1 ${
              section.lessons.length > 0
                ? "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                : "text-gray-400 opacity-50"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SectionPage;