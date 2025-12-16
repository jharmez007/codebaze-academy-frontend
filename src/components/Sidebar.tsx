"use client";

import { useState } from "react";
import Link from "next/link";
import { SquarePlay } from "lucide-react";
import { IoCheckbox } from "react-icons/io5";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { normalizeImagePath } from "@/utils/normalizeImagePath";

// Circular Progress Component
function CircularProgress({
  value,
  total,
  size = 20,
  strokeWidth = 2,
}: {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / total) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#000"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}

const Sidebar = ({ course, activeSection, activeLesson, fullscreen, completedLessons = new Set() }: any) => {
  
  // track open/closed state per section
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    () =>
      Object.fromEntries(course.sections.map((s: any) => [s.slug, true])) // all open by default
  );
  
  const toggleSection = (slug: string) => {
    setOpenSections((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };
  
  if (fullscreen) return null;
  
  return (
    <aside className="w-100 bg-white p-4 overflow-y-auto hidden lg:block sticky top-0 h-screen scrollbar-hide">
      {/* Course header */}
      <div className="flex gap-3 mb-6">
        <img
          src={normalizeImagePath(course.image as any)}
          alt={course.title}
          width={100}
          height={100}
          className="rounded object-cover"
        />
        <div className="flex flex-col">
          <Link
            href={`/course/${course.slug}`}
            className="text-sm text-black font-semibold hover:underline"
          >
            {course.title}
          </Link>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <CircularProgress value={completedLessons.size} total={course.total_lessons} />
            {completedLessons.size}/{course.total_lessons} completed
          </div>
        </div>
      </div>

      {/* Sections */}
      {course.sections.map((section: any) => {
        const isOpen = openSections[section.slug];
        return (
          <div key={section.slug} className="mb-4">
            {/* Section header */}
            <div className="flex items-center w-max rounded px-2 py-1 hover:bg-gray-100">
              <Link
                href={`/course/${course.slug}/section/${section.slug}`}
                className="font-bold text-gray-800"
              >
                {section.name}
              </Link>
              <button
                onClick={() => toggleSection(section.slug)}
                className="p-1 text-black"
              >
                {isOpen ? (
                  <IoMdArrowDropdown className="w-4 h-4" />
                ) : (
                  <IoMdArrowDropright className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Lessons */}
            {isOpen && (
              <ul className="mt-2 space-y-1">
                {section.lessons.map((lesson: any) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                      className={`flex gap-2 px-2 py-1 rounded transition  ${
                        activeSection === section.slug &&
                        activeLesson === lesson.slug
                          ? "bg-gray-100 text-black font-medium"
                          : "text-black hover:bg-gray-100"
                      }`}
                    >
                      {completedLessons.has(lesson.id) ? (
                        <IoCheckbox className="w-5 h-5 font-extrabold pt-1" />
                      ) : (
                        <SquarePlay className="w-5 h-5 font-extrabold pt-1" />
                      )}
                      <span>{lesson.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
