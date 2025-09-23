"use client";

import { students } from "@/data/students";
import StudentTable from "@/components/admin/students/StudentTable";

export default function StudentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Students</h1>
      <StudentTable data={students} />
    </div>
  );
}
