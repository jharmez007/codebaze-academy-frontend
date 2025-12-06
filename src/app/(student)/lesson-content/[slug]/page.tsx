"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ScrollNavbar } from "../../../../components";
import { SquarePlay, NotebookText } from "lucide-react";
import { getCourseById, getCourses, Course } from "@/services/studentCourseService";
import { normalizeImagePath } from "@/utils/normalizeImagePath";


/** ✅ Converts seconds to minutes (rounded up) */
function formatDuration(seconds: number | string): string {
  const sec = typeof seconds === "string" ? parseInt(seconds) : seconds;
  if (isNaN(sec) || sec <= 0) return "";
  const minutes = Math.ceil(sec / 60);
  return `${minutes} min${minutes > 1 ? "s" : ""}`;
}

/** ✅ Converts bytes to MB (rounded to the nearest whole number) */
function formatSize(bytes: number | string): string {
  const b = typeof bytes === "string" ? parseFloat(bytes) : bytes;
  if (isNaN(b) || b <= 0) return "";
  const mb = b / (1024 * 1024);
  return `${Math.round(mb)} MB`;
}

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCourse = async () => {
    const startTime = Date.now();

    try {
      const cachedCourses = localStorage.getItem("courses");
      let matchedCourse: Course | undefined;

      if (cachedCourses) {
        const parsed = JSON.parse(cachedCourses);
        matchedCourse = parsed.find((c: Course) => c.slug === slug);
      }

      if (!matchedCourse) {
        const { data: allCourses } = await getCourses({
        headers: { "X-Dev-IP": "8.8.8.8" },
      });
        matchedCourse = allCourses?.find((c) => c.slug === slug);
      }

      if (!matchedCourse) {
        setCourse(null);
        setLoading(false);
        return;
      }

      const { data: fullCourse } = await getCourseById(matchedCourse.id, {
        headers: { "X-Dev-IP": "8.8.8.8" },
      });
      setCourse(fullCourse || matchedCourse);
    } catch (err) {
      console.error("Error loading course:", err);
      setCourse(null);
    } finally {
      // 🕒 Ensure loading lasts at least 1 second
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1000 - elapsed, 0);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  fetchCourse();
}, [slug]);


  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 animate-pulse">
        {/* Course Banner */}
        <div className="w-full py-8 md:py-16 bg-gray-200">
          <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
            {/* Left: Course Info */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <div className="bg-gray-300 h-6 w-1/4 rounded" /> {/* Price */}
              <div className="bg-gray-300 h-10 md:h-12 w-2/3 rounded" /> {/* Title */}
              <div className="bg-gray-300 h-5 w-1/2 rounded" /> {/* Lessons */}
              <div className="bg-gray-300 h-20 w-full rounded mt-4" /> {/* Description */}
              <div className="bg-gray-300 h-12 w-32 rounded mt-6" /> {/* Button */}
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-2/3 h-60 md:h-72 bg-gray-300 rounded-lg shadow-md" />
          </div>
        </div>

        {/* Course Sections */}
        <div className="w-full py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-12">
            {[...Array(3)].map((_, sectionIdx) => (
              <div key={sectionIdx} className="space-y-4">
                <div className="bg-gray-300 h-8 md:h-10 w-1/3 rounded" /> {/* Section title */}
                <div className="bg-gray-300 h-4 w-2/3 rounded" /> {/* Section description */}

                <ul className="space-y-3">
                  {[...Array(4)].map((_, lessonIdx) => (
                    <li
                      key={lessonIdx}
                      className="flex items-center gap-4 w-full"
                    >
                      <div className="bg-gray-300 w-6 h-6 rounded" /> {/* Icon */}
                      <div className="bg-gray-300 h-4 w-1/3 rounded" /> {/* Lesson title */}
                      <div className="bg-gray-300 h-4 w-16 rounded ml-auto" /> {/* Duration/size */}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (!course) {
    notFound();
  }

  return (
    <div
      className="w-full min-h-screen"
    >
      <ScrollNavbar course={course} />

      {/* Course Banner */}
      <div className="w-full py-8 md:py-16 bg-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-2/3">
            <div className="mb-1 text-[#00bf63] font-semibold text-lg">
              {course.price === 0
                ? "Free"
                : `${course.currency === "USD" ? "$" : "₦"}${course.price.toLocaleString()}`}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
              {course.title}
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Course • {course.total_lessons} Lessons
            </p>
            <p className="text-gray-600 font-extralight text-lg my-6">
              {course.long_description}
            </p>
            <Link
              href={`/checkout/${course.slug}`}
              prefetch
              className="inline-block px-6 py-3 bg-[#00bf63] text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Buy Now
            </Link>
          </div>

          <div className="w-full md:w-2/3">
            <Image
              src={normalizeImagePath(course.image as any)}
              alt={course.title}
              width={500}
              height={300}
              loading="eager"
              priority
              className="rounded-lg shadow-md cursor-pointer w-full object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
      </div>

      {/* Course Sections */}
      {course.sections && (
        <div className="w-full py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl text-black font-bold mb-6">
              Contents
            </h2>
            <div className="space-y-8">
              {course.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xl md:text-2xl text-black font-semibold">
                    {section.name}
                  </h3>

                  {section.description && (
                    <p className="text-gray-700 text-base md:text-lg my-5 font-extralight">
                      {section.description}
                    </p>
                  )}

                  <ul className="space-y-4 md:space-y-6 text-base md:text-lg">
                    {section.lessons?.map((lesson, lidx) => (
                      <li key={lidx} className="flex items-center text-gray-700">
                        {lesson.duration ? (
                          <SquarePlay className="w-4 h-4 mr-2 font-bold" />
                        ) : (
                          <NotebookText className="w-4 h-4 mr-2 font-bold" />
                        )}
                        <span
                          className="max-w-[140px] font-extralight sm:max-w-xs text-gray-700 md:max-w-md truncate"
                          title={lesson.title}
                        >
                          {lesson.title}
                        </span>
                        {/* ✅ Display duration and size nicely */}
                        {lesson.duration && (
                          <span className="ml-2 text-gray-500">
                            · {formatDuration(lesson.duration)}
                          </span>
                        )}
                        {lesson.size && (
                          <span className="ml-2 text-gray-500">
                            · {formatSize(lesson.size)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
