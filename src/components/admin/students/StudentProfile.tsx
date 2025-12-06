"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { BookOpen, CheckCircle, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suspendStudent } from "@/services/studentService";

type Course = {
  title: string;
  progress: number;
};

type Activity = {
  id: number;
  type: "lesson" | "quiz" | "other";
  text: string;
  date: string;
};

type Student = {
  id: number;
  name: string;
  email: string;
  courses: Course[];
  signupDate: string;
  status: "active" | "suspended";
  activity: Activity[];
};

export default function StudentProfile({ student }: { student: Student }) {
  const [currentStatus, setCurrentStatus] = useState(student.status);

  // 🔹 Suspend / Reactivate student
  const handleAction = async (action: "suspend" | "activate") => {
    try {
      const res = await suspendStudent(Number(student.id), action);
      if (res.status && res.status < 300) {
        const newStatus = action === "suspend" ? "suspended" : "active";
        setCurrentStatus(newStatus);
        toast.success(
          action === "suspend"
            ? `${student.name} has been suspended`
            : `${student.name} has been reactivated`
        );
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-background shadow rounded-lg p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm mb-4">
        <Link href="/admin/students" className="hover:underline">
          Students
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="font-medium">{student.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p>{student.email}</p>
          <p className="text-sm">
            Joined {new Date(student.signupDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              currentStatus === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {currentStatus}
          </span>

          <ConfirmModal
            trigger={
              <Button
                variant={currentStatus === "active" ? "destructive" : "default"}
                size="sm"
              >
                {currentStatus === "active" ? "Suspend" : "Reactivate"}
              </Button>
            }
            title={currentStatus === "active" ? "Suspend Student" : "Reactivate Student"}
            description={`Are you sure you want to ${
              currentStatus === "active" ? "suspend" : "reactivate"
            } ${student.name}?`}
            confirmLabel={currentStatus === "active" ? "Suspend" : "Reactivate"}
            onConfirm={() =>
              handleAction(currentStatus === "active" ? "suspend" : "activate")
            }
          />
        </div>
      </div>

      {/* Course Progress */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
        {student.courses.length > 0 ? (
          <div className="space-y-4">
            {student.courses.map((course, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{course.title}</span>
                  <span className="text-sm">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm">No courses enrolled.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {student.activity.length > 0 ? (
          <ul className="space-y-3">
            {student.activity.map((act) => (
              <li
                key={act.id}
                className="flex items-start gap-3 border-b pb-2 last:border-none last:pb-0"
              >
                <span className="mt-0.5">
                  {act.type === "lesson" ? (
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  ) : act.type === "quiz" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                  )}
                </span>
                <div>
                  <p className="text-sm">{act.text}</p>
                  <p className="text-xs">
                    {new Date(act.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
