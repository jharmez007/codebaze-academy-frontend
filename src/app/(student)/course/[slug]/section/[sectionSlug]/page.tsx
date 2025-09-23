"use client";

import { useParams } from "next/navigation";
import { courses } from "@/data/courses";
import { Breadcrumb } from "../../../../../../components";
import { Sidebar } from "../../../../../../components";
import Link from "next/link";

const SectionPage = () => {
  const { slug, sectionSlug } = useParams();

  // find course by slug
  const course = courses.find((c) => c.slug === slug);

  // find section by slug
  const section = course?.sections.find((s) => s.slug === sectionSlug);

  if (!course || !section) return <p>Section not found</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar course={course} activeSection={section.slug} />

      <main className="flex-1 p-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: "Course", href: `/course/${course.slug}` },
            { label: section.section },
          ]}
        />

        <h1 className="text-xl font-bold mb-2">{section.section}</h1>
        <p className="text-gray-600 mb-6">{section.description}</p>

        <ul className="space-y-2">
          {section.lessons.map((lesson) => (
            <li key={lesson.slug} className="p-3 border rounded hover:bg-gray-50">
              <Link
                href={`/course/${course.slug}/section/${section.slug}/lesson/${lesson.slug}`}
                className="block"
              >
                {lesson.title}{" "}
                <span className="text-gray-400 text-sm">({lesson.duration})</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SectionPage;
