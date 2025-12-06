"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import StudentProfile from "@/components/admin/students/StudentProfile";
import { getStudentById } from "@/services/studentService";

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

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        setLoading(true);
        const res = await getStudentById(Number(id));

        if (res.data) {
          const stu = res.data;

          // ✅ Adjusted mapping to match backend response
          const formatted: Student = {
            id: stu.id,
            name: stu.name,
            email: stu.email,
            courses:
              stu.enrollments?.map((enrollment: any) => ({
                // You can later fetch course titles by ID if needed
                title: enrollment.course_title,
                progress: enrollment.progress,
              })) || [],
            signupDate: stu.date_joined,
            status: stu.is_active ? "active" : "suspended",
            activity: [],
          };

          setStudent(formatted);
        } else {
          toast.error(res.message || "Failed to load student");
        }
      } catch (error) {
        toast.error(
          "An unexpected error occurred while fetching student details"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading student...
      </div>
    );
  }

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  return (
    <div className="p-6">
      <StudentProfile student={student} />
    </div>
  );
}
