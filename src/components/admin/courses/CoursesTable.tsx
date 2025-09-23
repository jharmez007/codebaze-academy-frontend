"use client";

import { useState } from "react";
import { courses } from "@/data/courses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function CoursesTable({ data }: { data: typeof courses }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // 🔎 Filtering
  const filtered = data.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
        ? c.type === "dynamic"
        : c.type !== "dynamic";

    return matchesSearch && matchesStatus;
  });

  const deleteCourse = async (courseSlug: string) => {
    const fakeDelete = new Promise((resolve) => {
      setTimeout(() => resolve("deleted"), 1000);
    });

    try {
      await fakeDelete;
      window.location.href = "/admin/courses?deleted=1";
    } catch (error) {
      window.location.href = "/admin/courses?deleteError=1";
    }
  };

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

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

      {/* Desktop Table */}
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
              <TableRow key={course.slug}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>${course.price}</TableCell>
                <TableCell>{course.total}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      course.type === "dynamic"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {course.type === "dynamic" ? "Published" : "Draft"}
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
                        <a href={`/admin/courses/${course.slug}`}>Edit</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/admin/courses/${course.slug}/lessons`}>
                          Manage Lessons
                        </a>
                      </DropdownMenuItem>
                      <ConfirmModal
                        title="Delete Course"
                        description="Are you sure you want to delete this course? This action cannot be undone."
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={() => deleteCourse(course.slug)}
                        trigger={
                          <button className="w-full text-left px-2 py-1.5 text-red-600 text-sm hover:bg-red-100 rounded-sm">
                            Delete
                          </button>
                        }
                      />
                      <DropdownMenuItem>
                        {course.type === "dynamic" ? "Unpublish" : "Publish"}
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

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {paginated.map((course) => (
          <div
            key={course.slug}
            className="p-4 border rounded-lg bg-white shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{course.title}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  course.type === "dynamic"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {course.type === "dynamic" ? "Published" : "Draft"}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              ${course.price} • {course.total} lessons
            </p>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full justify-center"
              >
                <a href={`/admin/courses/${course.slug}`}>Edit</a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full justify-center"
              >
                <a href={`/admin/courses/${course.slug}/lessons`}>
                  Manage Lessons
                </a>
              </Button>
              <ConfirmModal
                title="Delete Course"
                description="Are you sure you want to delete this course? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={() => deleteCourse(course.slug)}
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-center"
                  >
                    Delete
                  </Button>
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
