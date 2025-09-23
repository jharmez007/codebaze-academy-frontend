"use client";

import { useState } from "react";
import Link from "next/link"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export type Course = {
  title: string;
  progress: number;
};

export type Activity = {
  id: number;
  type: "lesson" | "quiz" | "other";
  text: string;
  date: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  courses: Course[];
  signupDate: string;
  status: "active" | "suspended";
  activity: Activity[];
};


export default function StudentTable({ data }: { data: Student[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "signupDate">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = data.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(search.toLowerCase()) ||
      stu.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : stu.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? new Date(a.signupDate).getTime() - new Date(b.signupDate).getTime()
        : new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime();
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleSort = (field: "name" | "signupDate") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:items-center sm:justify-between">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to first page when filtering
          }}
          className="w-full sm:w-64"
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1); // reset when filter changes
            }}
            defaultValue="all"
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("name")}
              className="flex-1 sm:flex-none"
            >
              Name <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("signupDate")}
              className="flex-1 sm:flex-none"
            >
              Signup Date <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table wrapper for horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Courses Enrolled</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((stu) => (
                <TableRow key={stu.id}>
                  <TableCell className="font-medium">{stu.name}</TableCell>
                  <TableCell>{stu.email}</TableCell>
                  <TableCell>{stu.courses.map((c) => c.title).join(", ")}</TableCell>
                  <TableCell>
                    {new Date(stu.signupDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        stu.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stu.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/students/${stu.id}`}>View Profile</Link>
                        </DropdownMenuItem>

                        {stu.status === "active" ? (
                          <ConfirmModal
                            trigger={
                              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded-sm">
                                Suspend
                              </button>
                            }
                            title="Suspend Student"
                            description={`Are you sure you want to suspend ${stu.name}?`}
                            confirmLabel="Suspend"
                            onConfirm={() => alert(`Suspended ${stu.name}`)}
                          />
                        ) : (
                          <ConfirmModal
                            trigger={
                              <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded-sm">
                                Reactivate
                              </button>
                            }
                            title="Reactivate Student"
                            description={`Are you sure you want to reactivate ${stu.name}?`}
                            confirmLabel="Reactivate"
                            onConfirm={() => alert(`Reactivated ${stu.name}`)}
                          />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(val) => {
                setRowsPerPage(Number(val));
                setCurrentPage(1); // reset page when changing rows
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page navigation */}
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
