"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data/courses";
import { Breadcrumb } from "../../../../components";
import { Sidebar } from "../../../../components";
import Link from "next/link";

const CoursePage = () => {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);

  if (!course) return <p>Course not found</p>;

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar course={course} />

      <main className="flex-1 p-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: course.title },
          ]}
        />

        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.longDescription}</p>

        <div>
          {course.sections.map((section) => (
            <div key={section.slug} className="mb-6">
              <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
                {section.section}
                {/* Section link */}
                <Link
                  href={`/course/${course.slug}/section/${section.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Section →
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-2">{section.description}</p>
              <ul className="space-y-1">
                {section.lessons.map((lesson) => (
                  <li key={lesson.slug} className="pl-3 text-sm">
                    <Link
                      href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                      className="text-gray-700 hover:underline"
                    >
                      {lesson.title}
                    </Link>{" "}
                    <span className="text-gray-400">({lesson.duration})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
