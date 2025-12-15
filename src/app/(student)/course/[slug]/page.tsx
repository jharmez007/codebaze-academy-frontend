"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "../../../../components";
import { Sidebar } from "../../../../components";
import Link from "next/link";
import { useFullscreen } from "../../../../context/FullscreenContext";
import { SquarePlay } from "lucide-react";
import { getCourses } from "@/services/studentCourseService";
import { getCourseId } from "@/services/studentService";

const CoursePage = () => {
  const { slug } = useParams();
  const { fullscreen } = useFullscreen();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!slug) return;

    async function fetchCourse() {
      try {
        // 1️⃣ Get all courses (contains id + slug)
        const listRes = await getCourses();
        const courseList = listRes?.data || [];

        // 2️⃣ Find course by slug
        const matched = courseList.find((c: any) => c.slug === slug);

        if (!matched) {
          setError("Course not found");
          setLoading(false);
          return;
        }

        // 3️⃣ Fetch full course using ID
        const fullRes = await getCourseId(matched.id);

        if (fullRes?.data) {
          setCourse(fullRes.data);
          const completedIds = fullRes.data.sections.flatMap((s: any) =>
            s.lessons?.filter((l: any) => l.is_completed).map((l: any) => l.id) || []
          );

          setCompletedLessons(new Set(completedIds));
        } else {
          setError("Failed to load course");
        }
      } catch {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [slug]);

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
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar course={course} fullscreen={fullscreen} completedLessons={completedLessons} />

      <main className="flex-1 p-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course" },
          ]}
        />

        <h1 className="text-2xl font-bold mb-6">{course.title}</h1>

        {/* updated → long_description */}
        <p className="text-gray-600 mb-6">{course.long_description}</p>

        <div className="space-y-6">
          {course.sections?.map((section: any) => {
            const lessonCount = section.lessons.length;
            const lessonLabel = lessonCount === 1 ? "Lesson" : "Lessons";

            return (
              <div
                key={section.id}
                className="border border-gray-300 rounded-lg p-4"
              >
                {/* updated → section.name */}
                <Link
                  href={`/course/${course.slug}/section/${section.slug}`}
                  className="font-semibold text-lg px-2 text-gray-900 hover:underline"
                >
                  {section.name}
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
                  {section.lessons.map((lesson: any) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition font-medium"
                      >
                        <SquarePlay className="w-4 h-4 text-gray-600" />
                        <p className="truncate max-sm:w-70">{lesson.title}</p>
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
