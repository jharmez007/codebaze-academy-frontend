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

/** ✅ Converts "HH:MM:SS" or "MM:SS" to minutes (rounded up) */
function formatDuration(duration: string): string {
  if (!duration) return "";

  const parts = duration.split(":").map(Number);
  if (parts.some(isNaN)) return "";

  let totalSeconds = 0;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    totalSeconds = minutes * 60 + seconds;
  } else {
    return "";
  }

  const mins = Math.ceil(totalSeconds / 60);
  return `${mins} min${mins > 1 ? "s" : ""}`;
}

/** ✅ Auto-detects KB / MB / GB and rounds to nearest whole number */
function formatSize(size: string): string {
  if (!size) return "";

  const match = size.match(/([\d.]+)\s*(KB|MB|GB)?/i);
  if (!match) return "";

  const value = parseFloat(match[1]);
  let unit = (match[2] || "MB").toUpperCase();

  if (isNaN(value)) return "";

  // Normalize everything to MB first
  let sizeInMB = value;

  if (unit === "KB") sizeInMB = value / 1024;
  if (unit === "GB") sizeInMB = value * 1024;

  // Decide best display unit
  if (sizeInMB < 1) {
    return `${Math.round(sizeInMB * 1024)} KB`;
  }

  if (sizeInMB >= 1024) {
    return `${Math.round(sizeInMB / 1024)} GB`;
  }

  return `${Math.round(sizeInMB)} MB`;
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
        <Link href="/admin/courses">
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
