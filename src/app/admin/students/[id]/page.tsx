"use client";

import { useParams } from "next/navigation";
import { students } from "@/data/students";
import StudentProfile from "@/components/admin/students/StudentProfile";

export default function StudentProfilePage() {
  const { id } = useParams();
  const student = students.find((s) => s.id === id);

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  return (
    <div className="p-6">
      <StudentProfile student={student} />
    </div>
  );
}
