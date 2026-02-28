"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "../../../../../../../../components";
import { Breadcrumb } from "../../../../../../../../components";
import { QuizQuestion  } from "../../../../../../../../components";
import { VideoPlayer } from "../../../../../../../../components";
import { CommentsSection } from "../../../../../../../../components/comments";
import { useFullscreen } from "../../../../../../../../context/FullscreenContext";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Square } from "lucide-react";
import { IoCheckboxOutline } from "react-icons/io5"
import { FiDownload } from "react-icons/fi";

import { toast } from "sonner";

import { getCourses } from "@/services/studentCourseService";
import { getCourseId } from "@/services/studentService";
import { markLessonComplete, uncompleteLesson } from "@/services/lessonService";
import { downloadLessonDocument } from "@/services/lessonService";

import { normalizeImagePath } from "@/utils/normalizeImagePath";


const LessonPage = () => {
  const { slug, sectionSlug, lessonSlug } = useParams();
  const { fullscreen } = useFullscreen();
  
  const [course, setCourse] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const [quizVisible, setQuizVisible] = useState(false);
  
 useEffect(() => {
  if (!slug) return;

  async function fetchCourse() {
    try {
      const list = await getCourses();
      const matched = list?.data?.find((c: any) => c.slug === slug);
      if (!matched) return setLoading(false);

      const full = await getCourseId(matched.id);
      setCourse(full.data || null);

      // Initialize completed lessons from sections
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


 
  const sectionIndex = course?.sections.findIndex((s: any) => s.slug === sectionSlug);
  const section =
    sectionIndex !== undefined ? course?.sections[sectionIndex] : undefined;

  const lesson = section?.lessons.find((l: any) => l.slug === lessonSlug);

  const references = lesson?.reference_link
  ? JSON.parse(lesson.reference_link)
  : [];


  if (loading) return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen p-4 lg:p-6 gap-6">
  {/* Sidebar Skeleton — hidden on mobile */}
  <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col gap-4">
    {/* Course header */}
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-gray-300 rounded-md animate-pulse" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
      </div>
    </div>

    {/* Sections */}
    {Array.from({ length: 3 }).map((_, idx) => (
      <div key={idx} className="flex flex-col gap-2">
        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" />
        {Array.from({ length: 2 }).map((_, j) => (
          <div
            key={j}
            className="h-3 bg-gray-300 rounded w-full ml-4 animate-pulse"
          />
        ))}
      </div>
    ))}
  </aside>

  {/* Lesson Page Skeleton */}
  <main className="flex-1 flex flex-col gap-4">
    {/* Breadcrumb */}
    <div className="flex gap-2 mb-4 flex-wrap">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="h-3 bg-gray-300 rounded w-16 sm:w-20 animate-pulse"
        />
      ))}
    </div>

    {/* Title */}
    <div className="h-6 w-2/3 sm:w-1/3 bg-gray-300 rounded animate-pulse mb-4" />

    {/* Video placeholder */}
    <div className="aspect-video bg-gray-300 rounded animate-pulse mb-4" />

    {/* Links */}
    <div className="flex flex-col gap-2 mb-4">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div
          key={idx}
          className="h-3 bg-gray-300 rounded w-1/3 sm:w-1/4 animate-pulse"
        />
      ))}
    </div>

    {/* Text content */}
    {Array.from({ length: 3 }).map((_, idx) => (
      <div
        key={idx}
        className="h-3 bg-gray-300 rounded w-full animate-pulse mb-2"
      />
    ))}

    {/* Buttons */}
    <div className="flex gap-2 mt-4 flex-wrap">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="h-8 w-20 sm:w-24 bg-gray-300 rounded animate-pulse"
        />
      ))}
    </div>

    {/* Comments section */}
    <div className="mt-6 flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="h-12 bg-gray-300 rounded animate-pulse" />
      ))}
    </div>
  </main>
</div>
  );
  if (!course || !section || !lesson) return <p>Lesson not found</p>;

  const isCompleted = completedLessons.has(lesson.id);

  const handleToggleComplete = async () => {
    try {
      const newSet = new Set(completedLessons);
      if (!isCompleted) {
        await markLessonComplete(lesson.id);
        newSet.add(lesson.id);
        toast.success("Lesson marked as completed");
      } else {
        await uncompleteLesson(lesson.id);
        newSet.delete(lesson.id);
        toast.success("Lesson marked as incomplete");
      }
      setCompletedLessons(newSet);
    } catch {
      toast.error("Failed to toggle lesson");
    }
  };

  // current lesson index
  const currentLessonIndex = section.lessons.findIndex(
    (l: any) => l.slug === lessonSlug
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

  const handleDownload = async (lessonId: number) => {
    const res = await downloadLessonDocument(lessonId);

    if (!res.data) return;

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lesson-document.pdf"; // optionally dynamic
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const hasQuiz = lesson.quizzes && lesson.quizzes.length > 0;


  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar
        course={course}
        activeSection={section.slug}
        activeLesson={lesson.slug}
        fullscreen={fullscreen}
        completedLessons={completedLessons}
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
        <div className="aspect-video bg-black mb-4 rounded-lg overflow-hidden">
          {lesson.video_url ? (
            <VideoPlayer
              videoUrl={normalizeImagePath(lesson.video_url)}
              videoType={
                lesson.video_url.includes('.m3u8')
                  ? 'application/x-mpegURL'
                  : undefined
              }
            />
          ) : (
            <p className="text-white flex items-center justify-center h-full">
              No video available
            </p>
          )}
        </div>

        {/* Lesson Document */}
        {lesson.document_url && (
          <div className="mb-6">
            <button
              onClick={() => handleDownload(lesson.id)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download Lesson Document</span>
            </button>
          </div>
        )}

        {references.length > 0 && (
          <div className="flex flex-col gap-2 my-4">
            <h3 className="font-semibold">Reference Links:</h3>
            {references.map((ref: string, i: number) => (
              <Link
                key={i}
                href={`https://${ref}`}
                target="_blank"
                className="underline text-gray-400 hover:text-black"
              >
                {ref}
              </Link>
            ))}
          </div>
        )}

        <p className="mb-6">
          {lesson.notes}
        </p>

        <button
          onClick={() => setQuizVisible((prev) => !prev)}
          disabled={!hasQuiz}
          className={`mt-4 px-4 py-2 rounded-md transition ${
            hasQuiz
              ? "bg-black text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          {!hasQuiz
            ? "No Quiz Available"
            : quizVisible
            ? "Hide Quiz"
            : "Start Quiz"}
        </button>

        {quizVisible && hasQuiz && (
          <div className="my-6">
            <h2 className="text-lg font-semibold mb-4">Lesson Quiz</h2>

            {lesson.quizzes.map((quiz: any) => (
              <QuizQuestion key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}

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
            onClick={handleToggleComplete}
            className={`py-3 px-5 text-sm border rounded-md flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              isCompleted
                ? "bg-gray-300 text-black border-gray-400 cursor-pointer"
                : "bg-black text-white border-black cursor-pointer"
            }`}
          >
            {isCompleted ? (
              <IoCheckboxOutline className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {isCompleted ? "Completed" : "Complete"}
          </button>
        </div>

        {/* Comments */}
        <CommentsSection lessonId={lesson.id} />
      </main>
    </div>
  );
};

export default LessonPage;