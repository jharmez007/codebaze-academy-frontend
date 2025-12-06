"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "../../../../../../components";
import { Sidebar } from "../../../../../../components";
import Link from "next/link";
import { useFullscreen } from "../../../../../../context/FullscreenContext";
import { SquarePlay, ArrowLeft, ArrowRight } from "lucide-react";

import { getCourses } from "@/services/studentCourseService";
import { getCourseId } from "@/services/studentService";

const SectionPage = () => {
  const { slug, sectionSlug, lessonSlug } = useParams();
  const { fullscreen } = useFullscreen();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!slug) return;

    async function fetchCourse() {
      try {
        const list = await getCourses();
        const all = list?.data || [];

        const matched = all.find((c: any) => c.slug === slug);
        if (!matched) return setLoading(false);

        const full = await getCourseId(matched.id);
        setCourse(full.data || null);

        const completedIds = full.data.sections.flatMap((s: any) =>
          s.lessons?.filter((l: any) => l.is_completed).map((l: any) => l.id) || []
        );

        setCompletedLessons(new Set(completedIds));
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [slug]);

  // find section by slug
  const sectionIndex = course?.sections.findIndex(
    (s: any) => s.slug === sectionSlug
  );
  const section = sectionIndex !== undefined ? course?.sections[sectionIndex] : undefined;

  if (loading) return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      {/* SIDEBAR SKELETON */}
      <aside className="w-64 bg-white p-4 hidden lg:block border-r border-gray-200">
        {/* Course header */}
        <div className="flex gap-3 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-md animate-pulse" />
          <div className="flex flex-col justify-center gap-2 flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
          </div>
        </div>

        {/* Sections list */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse mb-2" />
              <ul className="space-y-2 ml-4">
                {Array.from({ length: 2 }).map((_, j) => (
                  <li key={j}>
                    <div className="h-3 bg-gray-300 rounded w-4/5 animate-pulse" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT SKELETON */}
      <main className="flex-1 p-6">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-3 w-20 bg-gray-300 rounded animate-pulse"
            />
          ))}
        </div>

        {/* Title */}
        <div className="h-6 w-1/3 bg-gray-300 rounded animate-pulse mb-4" />

        {/* Description */}
        <div className="h-3 w-3/4 bg-gray-300 rounded animate-pulse mb-2" />
        <div className="h-3 w-2/3 bg-gray-300 rounded animate-pulse mb-6" />

        {/* Sections */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-lg p-4 mb-6 bg-white"
          >
            <div className="h-4 bg-gray-300 rounded w-2/5 animate-pulse mb-2" />
            <div className="h-3 bg-gray-300 rounded w-3/5 animate-pulse mb-6" />
            <div className="h-3 bg-gray-300 rounded w-1/4 animate-pulse mb-4" />

            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="h-3 w-1/2 bg-gray-300 rounded animate-pulse mb-2 ml-2"
              />
            ))}
          </div>
        ))}
      </main>
    </div>
  );
  if (!course || !section) return <p>Section not found</p>;

  // find current lesson index
  const currentLessonIndex = lessonSlug
    ? section.lessons.findIndex((l: any) => l.slug === lessonSlug)
    : 0;
  const currentLesson = currentLessonIndex !== -1 ? section.lessons[currentLessonIndex] : section.lessons[0];


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
        completedLessons={completedLessons}
      />

      <main className="flex-1 p-6 relative">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course", href: `/course/${course.slug}` },
            { label: "Section" },
          ]}
        />

        <h1 className="text-xl font-bold mb-6">{section.name}</h1>
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
            {section.lessons.map((lesson: any) => (
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