"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner"; // ✅ Toast notifications
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
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

// ✅ Services
import { getStudents, suspendStudent } from "@/services/studentService";

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
  id: number;
  name: string;
  email: string;
  courses: Course[];
  signupDate: string;
  status: "active" | "suspended";
  activity: Activity[];
};

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "signupDate">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🔹 Load students on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await getStudents();
        if (res.data) {
          const formatted = res.data.map((stu: any) => ({
            id: stu.id,
            name: stu.name,
            email: stu.email,
            courses:
              typeof stu.courses === "string"
                ? stu.courses.split(",").map((t: string) => ({ title: t.trim(), progress: 0 }))
                : stu.courses,
            signupDate: stu.date,
            status: stu.is_suspended ? "suspended" : "active",
            activity: [],
          }));
          setStudents(formatted);
        } else {
          toast.error(res.message || "Failed to load students");
        }
      } catch (err) {
        toast.error("An unexpected error occurred while loading students");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // 🔹 Suspend / Reactivate student
  const handleSuspend = async (id: number, suspend: boolean, name: string) => {
    try {
      const res = await suspendStudent(id, suspend);
      if (res.status && res.status < 300) {
        toast.success(
          suspend
            ? `${name} has been suspended`
            : `${name} has been reactivated`
        );
        setStudents((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, status: suspend ? "suspended" : "active" }
              : s
          )
        );
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  // 🔎 Filtering
  const filtered = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(search.toLowerCase()) ||
      stu.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : stu.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🔢 Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? new Date(a.signupDate).getTime() -
            new Date(b.signupDate).getTime()
        : new Date(b.signupDate).getTime() -
            new Date(a.signupDate).getTime();
    }
  });

  // 📄 Pagination
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
            setCurrentPage(1);
          }}
          className="w-full sm:w-64"
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
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
            >
              Name <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("signupDate")}
            >
              Signup Date <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
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
  {loading ? (
    <TableRow>
      <TableCell colSpan={6} className="text-center text-gray-500 py-10">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading students...
        </div>
      </TableCell>
    </TableRow>
  ) : students.length === 0 ? (
    // 🧩 No students registered at all
    <TableRow>
      <TableCell colSpan={6} className="text-center text-gray-500 py-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-base font-medium">No students registered yet</p>
          <p className="text-sm text-muted-foreground">
            Once students sign up, they’ll appear here.
          </p>
        </div>
      </TableCell>
    </TableRow>
  ) : paginated.length === 0 ? (
    // 🔎 No results for filters/search
    <TableRow>
      <TableCell colSpan={6} className="text-center text-gray-500 py-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-base font-medium">No matching students found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    // ✅ Normal rendering
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
          {/* Actions */}
          ...
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
