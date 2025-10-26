"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "../../../../../../../../components";
import { Sidebar } from "../../../../../../../../components";
import Link from "next/link";
import { CommentsSection } from "../../../../../../../../components/comments/";
import { courses } from "@/data/courses";
import { useFullscreen } from "../../../../../../../../context/FullscreenContext";
import { ArrowLeft, ArrowRight, CheckSquare, Square } from "lucide-react";

const LessonPage = () => {
  const { slug, sectionSlug, lessonSlug } = useParams();

  const course = courses.find((c) => c.slug === slug);
  const sectionIndex = course?.sections.findIndex((s) => s.slug === sectionSlug);
  const section =
    sectionIndex !== undefined ? course?.sections[sectionIndex] : undefined;

  const lesson = section?.lessons.find((l) => l.slug === lessonSlug);

  const { fullscreen } = useFullscreen();
  const [isCompleted, setIsCompleted] = useState(false);

  if (!course || !section || !lesson) return <p>Lesson not found</p>;

  // current lesson index
  const currentLessonIndex = section.lessons.findIndex(
    (l) => l.slug === lessonSlug
  );

  // NEW SEAMLESS NAVIGATION LOGIC
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === section.lessons.length - 1;

  // Previous: Lesson 1 → Section Page | Others → Previous Lesson
  const prevHref = isFirstLesson
    ? `/course/${course.slug}/section/${section.slug}`  // LESSON 1 → SECTION PAGE
    : `/course/${course.slug}/section/${section.slug}/lesson/${section.lessons[currentLessonIndex - 1].slug}`;  // OTHER → PREV LESSON

  // Next: Last Lesson → Next Section Page | Others → Next Lesson
  const nextHref = isLastLesson && sectionIndex! < course.sections.length - 1
    ? `/course/${course.slug}/section/${course.sections[sectionIndex! + 1].slug}`  // LAST LESSON → NEXT SECTION
    : !isLastLesson
    ? `/course/${course.slug}/section/${section.slug}/lesson/${section.lessons[currentLessonIndex + 1].slug}`  // OTHER → NEXT LESSON
    : "#";  // LAST SECTION, LAST LESSON → DISABLED

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar
        course={course}
        activeSection={section.slug}
        activeLesson={lesson.slug}
        fullscreen={fullscreen}
      />

      <main
        className={`flex-1 p-6 transition-all ${
          fullscreen ? "max-w-4xl mx-auto" : ""
        }`}
      >
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course", href: `/course/${course.slug}` },
            {
              label: "Section",
              href: `/course/${course.slug}/section/${section.slug}`,
            },
            { label: "Lesson" },
          ]}
        />

        <h1 className="text-xl font-bold mb-6">{lesson.title}</h1>

        {/* Video player */}
        <div className="relative bg-black overflow-hidden mb-4">
          <div className="aspect-video flex items-center justify-center text-white">
            {lesson.title}
          </div>
        </div>

        {/* Links and Notes */}
        <div className="flex flex-col gap-2 mb-6">
          <Link
            className="underline text-gray-400 hover:text-black transition ease-in"
            href="#"
          >
            Full React Course
          </Link>
          <Link
            className="underline text-gray-400 hover:text-black transition ease-in"
            href="#"
          >
            Full React Article
          </Link>
        </div>

        <p className="mb-6">
          In this video I cover everything you need to know about the useState
          hook. I also go over the basics of hooks as well so you can start
          using hooks in your own projects.
        </p>

        {/* Navigation buttons */}
        <div className="flex justify-end gap-2 mt-4 items-center">
          {/* Previous Button */}
          <Link
            href={prevHref}
            title={isFirstLesson ? "Section Overview" : "Previous Lesson"}
            className={`p-3 text-xs border rounded-md flex items-center gap-1 transition ${
              prevHref !== "#"
                ? "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                : "text-gray-400 opacity-50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Next Button */}
          <Link
            href={nextHref}
            title={
              isLastLesson && sectionIndex! < course.sections.length - 1
                ? "Next Section"
                : !isLastLesson
                ? "Next Lesson"
                : "No next content"
            }
            className={`p-3 text-xs border rounded-md flex items-center gap-1 transition ${
              nextHref !== "#"
                ? "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                : "text-gray-400 opacity-50"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Complete Toggle Button */}
          <button
            onClick={() => setIsCompleted((prev) => !prev)}
            className={`py-3 px-5 text-sm border rounded-md flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              isCompleted
                ? "bg-gray-300 text-black border-gray-400"
                : "bg-black text-white border-black"
            }`}
          >
            {isCompleted ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {isCompleted ? "Completed" : "Complete"}
          </button>
        </div>

        {/* Comments */}
        <CommentsSection />
      </main>
    </div>
  );
};

export default LessonPage;