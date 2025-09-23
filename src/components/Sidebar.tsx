"use client";
import { useState } from "react";
import Link from "next/link";

const Sidebar = ({ course, activeSection, activeLesson }: any) => {
  return (
    <aside className="w-64 border-r bg-white p-4 overflow-y-auto hidden lg:block">
      {course.sections.map((section: any) => {
        const [open, setOpen] = useState(true);

        return (
          <div key={section.slug} className="mb-4">
            {/* Section toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="w-full text-left font-semibold text-gray-800 flex justify-between items-center"
            >
              {section.section}
              <span>{open ? "−" : "+"}</span>
            </button>

            {/* Lessons */}
            {open && (
              <ul className="mt-2 space-y-1">
                {section.lessons.map((lesson: any) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                      className={`block text-sm px-2 py-1 rounded ${
                        activeSection === section.slug && activeLesson === lesson.slug
                          ? "bg-gray-200 text-black"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {lesson.title}
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
