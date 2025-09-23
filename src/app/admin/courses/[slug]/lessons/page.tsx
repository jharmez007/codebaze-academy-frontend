// src/app/admin/courses/[slug]/lessons/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { courses } from "@/data/courses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Video, FileText, ListChecks } from "lucide-react";

export default function LessonsPage() {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return <p className="p-6">Course not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">{course.title} – Lessons</h1>
        <Link href={`/admin/courses/${course.slug}`}>
          <Button variant="outline">Back to Course</Button>
        </Link>
      </div>

      {course.sections.map((section) => (
        <div key={section.slug} className="space-y-3">
          <h2 className="text-lg font-semibold">{section.section}</h2>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lesson Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.lessons.map((lesson) => (
                  <TableRow key={lesson.slug}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{lesson.duration}</TableCell>
                    <TableCell className="capitalize">{lesson.type}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Video
                          className={`w-4 h-4 ${
                            lesson.video?.url ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                        <FileText
                          className={`w-4 h-4 ${
                            lesson.notes?.url ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        <ListChecks
                          className={`w-4 h-4 ${
                            lesson.quizzes && lesson.quizzes.length > 0
                              ? "text-purple-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/courses/${course.slug}/lessons/${lesson.slug}`}
                      >
                        <Button size="sm" variant="outline">
                          Edit Content
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {section.lessons.map((lesson) => (
              <div
                key={lesson.slug}
                className="p-4 border rounded-lg bg-white shadow-sm space-y-2"
              >
                <p className="font-medium">{lesson.title}</p>
                <p className="text-sm text-gray-500">
                  {lesson.duration} • {lesson.type}
                </p>
                <div className="flex gap-3">
                  <Video
                    className={`w-4 h-4 ${
                      lesson.video?.url ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <FileText
                    className={`w-4 h-4 ${
                      lesson.notes?.url ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <ListChecks
                    className={`w-4 h-4 ${
                      lesson.quizzes && lesson.quizzes.length > 0
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <Link
                  href={`/admin/courses/${course.slug}/lessons/${lesson.slug}`}
                >
                  <Button size="sm" className="mt-2 w-full">
                    Edit Content
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
