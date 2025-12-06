// src/app/admin/courses/[slug]/lessons/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCourseLessonById } from "@/services/courseService";
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

export default function LessonsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No course ID provided.");
      setLoading(false);
      return;
    }

    getCourseLessonById(Number(id)).then((res) => {
      if (res.data) {
        setCourse(res.data);
      } else {
        setError(res.message || "Course not found");
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (error || !course) {
    return <p className="p-6">{error || "Course not found."}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">{course.title} – Lessons</h1>
        <Link href={`/admin/courses/${course.slug}`}>
          <Button variant="outline">Back to Course</Button>
        </Link>
      </div>

      {course.sections.map((section: any) => (
        <div key={section.id} className="space-y-3">
          <h2 className="text-lg font-semibold">{section.name}</h2>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lesson Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.lessons.map((lesson: any) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{formatDuration(lesson.duration)}</TableCell>
                    <TableCell className="capitalize">
                      {formatSize(lesson.size)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Video
                          className={`w-4 h-4 ${
                            lesson.video_url ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                        <FileText
                          className={`w-4 h-4 ${
                            lesson.document_url ? "text-blue-600" : "text-gray-400"
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
                        href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
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
            {section.lessons.map((lesson: any) => (
              <div
                key={lesson.id}
                className="p-4 border rounded-lg bg-white shadow-sm space-y-2"
              >
                <p className="font-medium">{lesson.title}</p>
                <p className="text-sm text-gray-500">
                  {formatDuration(lesson.duration)} • {lesson.type}
                </p>
                <p className="text-xs text-gray-400">
                  Size: {formatSize(lesson.size)}
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
