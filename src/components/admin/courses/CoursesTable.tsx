"use client";

import { useEffect, useState } from "react";
import {
  getCourses,
  deleteCourse as deleteCourseApi,
  publishCourse as publishCourseApi,
  Course,
} from "@/services/courseService";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";

export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 🚀 Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const result = await getCourses();
    if (result.data) {
      setCourses(result.data);
    } else {
      setError(result.message || "Failed to load courses");
    }
    setLoading(false);
  };

  // 🔎 Filtering
  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
        ? c.is_published 
        : !c.is_published;
    return matchesSearch && matchesStatus;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // 🗑️ Delete course (real-time update + toast)
  const handleDeleteCourse = async (id: number) => {
    toast.promise(deleteCourseApi(id), {
      loading: "Deleting course...",
      success: () => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        return "Course deleted successfully";
      },
      error: (err) => err?.message || "Failed to delete course",
    });
  };

  // 📢 Publish/Unpublish course (real-time update + toast)
  const handleTogglePublish = async (course: Course) => {
    const publish = course.is_published !== true;
    toast.promise(publishCourseApi(course.id, publish), {
      loading: publish ? "Publishing course..." : "Unpublishing course...",
      success: () => {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === course.id
              ? { ...c, is_published: publish ? true : false }
              : c
          )
        );
        return publish
          ? "Course published successfully"
          : "Course unpublished successfully";
      },
      error: (err) => err?.message || "Failed to update course status",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setPage(1);
            setStatusFilter(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading & Error states */}
      {loading && <p className="text-center py-6">Loading courses...</p>}
      {error && <p className="text-center text-red-600 py-6">{error}</p>}

      {/* Desktop Table */}
      {!loading && !error && (
        <>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Lessons</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>${course.price}</TableCell>
                    <TableCell>{course.total_lessons}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          course.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/admin/courses/${course.id}`}>Edit</a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/admin/courses/${course.id}/lessons`}>
                              Manage Lessons
                            </a>
                          </DropdownMenuItem>
                          <ConfirmModal
                            title="Delete Course"
                            description="Are you sure you want to delete this course? This action cannot be undone."
                            confirmLabel="Delete"
                            cancelLabel="Cancel"
                            onConfirm={() => handleDeleteCourse(course.id)}
                            trigger={
                              <button className="w-full text-left px-2 py-1.5 text-red-600 text-sm hover:bg-red-100 rounded-sm">
                                Delete
                              </button>
                            }
                          />
                          <DropdownMenuItem
                            onClick={() => handleTogglePublish(course)}
                          >
                            {course.is_published
                              ? "Unpublish"
                              : "Publish"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
