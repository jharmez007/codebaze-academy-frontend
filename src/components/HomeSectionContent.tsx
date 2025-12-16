"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { getCourses, Course } from "../services/studentCourseService";
import { normalizeImagePath } from "@/utils/normalizeImagePath";

const HomeSectionContent = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("courses");
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });

  useEffect(() => {
    const fetchCourses = async () => {
    const { data } = await getCourses({
        headers: { "X-Dev-IP": "41.210.11.223" },
      });
      
      console.log("Courses data fetched:", data);
    if (data && data.length > 0) {
      // Sort courses from latest to oldest
      const sortedData = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setCourses(sortedData);
      localStorage.setItem("courses", JSON.stringify(sortedData));
    }
  };
    fetchCourses();
  }, []);

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {courses.length === 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col md:flex-row items-center gap-6"
              >
                <div className="bg-gray-200 rounded-lg w-full md:w-2/3 h-[200px]" />
                <div className="w-full md:w-2/3 space-y-3">
                  <div className="bg-gray-200 h-5 w-1/3 rounded" />
                  <div className="bg-gray-200 h-8 w-2/3 rounded" />
                  <div className="bg-gray-200 h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              {/* Course Image */}
              <div className="w-full md:w-2/3">
                <Link href={`/lesson-content/${course.slug}`} 
               >
                  <img
                    src={normalizeImagePath(course.image as any)}
                    alt={course.title}
                    width={500}
                    height={300}
                    // priority={i < 2} // only pre-load top two images
                    className="rounded-lg shadow-md cursor-pointer object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* Course Info */}
              <div className="w-full md:w-2/3 text-center md:text-left">
                <div className="mb-1 text-[#00bf63] font-semibold text-lg">
                  {course.price === 0
                    ? "Free"
                    : `${course.currency === "USD" ? "$" : "₦"}${course.price.toLocaleString()}`}
                </div>
                <Link href={`/lesson-content/${course.slug}`}>
                  <h3
                    className="text-xl md:text-4xl font-bold text-black transition-all duration-200 cursor-pointer hover:underline"
                    style={{
                      textDecorationColor: "#00bf63",
                      textUnderlineOffset: "6px",
                    }}
                  >
                    {course.title}
                  </h3>
                </Link>
                <p className="my-4 md:my-6 max-w-sm md:text-lg text-gray-600">
                  {course.description}
                </p>
                <Link
                  href={`/lesson-content/${course.slug}`}
                  prefetch
                  className="inline-block px-6 py-3 bg-[#00bf63] text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  View Course
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default HomeSectionContent;
