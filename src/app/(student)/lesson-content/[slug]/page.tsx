"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ScrollNavbar } from "../../../../components";
import { SquarePlay, NotebookText } from "lucide-react";
import { getCourseById, getCourses, Course } from "@/services/studentCourseService";
import { normalizeImagePath } from "@/utils/normalizeImagePath";
import { useCurrency } from "@/hooks/useCurency";

const CoursePrice = ({ price }: { price: number }) => {
  const displayPrice = useCurrency(price);
  return (
    <div className="mb-1 text-[#00bf63] text-lg font-semibold">
      {price === 0 ? "Free" : displayPrice}
    </div>
  );
};


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
      try {
        const cachedCourses = localStorage.getItem("courses");
        let matchedCourse: Course | undefined;

        if (cachedCourses) {
          const parsed = JSON.parse(cachedCourses);
          matchedCourse = parsed.find((c: Course) => c.slug === slug);
        }

        if (!matchedCourse) {
          const { data: allCourses } = await getCourses();
          matchedCourse = allCourses?.find((c) => c.slug === slug);
        }

        if (!matchedCourse) {
          setCourse(null);
          setLoading(false);
          return;
        }

        const { data: fullCourse } = await getCourseById(matchedCourse.id);
        setCourse(fullCourse || matchedCourse);
      } catch (err) {
        console.error("Error loading course:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
          <div className="bg-gray-300 rounded-lg h-[260px] w-full md:w-1/2" />
          <div className="flex flex-col justify-center w-full md:w-1/2 space-y-4">
            <div className="bg-gray-300 h-5 w-1/4 rounded" />
            <div className="bg-gray-300 h-8 w-2/3 rounded" />
            <div className="bg-gray-300 h-4 w-3/4 rounded" />
            <div className="bg-gray-300 h-10 w-1/3 rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full min-h-screen"
    >
      <ScrollNavbar course={course} />

      {/* Course Banner */}
      <div className="w-full py-8 md:py-16 bg-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-2/3">
            <CoursePrice price={course.price} />
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
    </motion.div>
  );
}
