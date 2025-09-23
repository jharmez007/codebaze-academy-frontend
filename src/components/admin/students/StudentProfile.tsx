"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { BookOpen, CheckCircle, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  id: string;
  name: string;
  email: string;
  courses: Course[];
  signupDate: string;
  status: "active" | "suspended";
  activity: Activity[];
};

export default function StudentProfile({ student }: { student: Student }) {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/admin/students" className="hover:underline">
          Students
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-700 font-medium">{student.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-gray-600">{student.email}</p>
          <p className="text-sm text-gray-500">
            Joined {new Date(student.signupDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              student.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {student.status}
          </span>

          {student.status === "active" ? (
            <ConfirmModal
              trigger={
                <Button variant="destructive" size="sm">
                  Suspend
                </Button>
              }
              title="Suspend Student"
              description={`Are you sure you want to suspend ${student.name}?`}
              confirmLabel="Suspend"
              onConfirm={() => alert(`Suspended ${student.name}`)}
            />
          ) : (
            <ConfirmModal
              trigger={
                <Button variant="default" size="sm">
                  Reactivate
                </Button>
              }
              title="Reactivate Student"
              description={`Are you sure you want to reactivate ${student.name}?`}
              confirmLabel="Reactivate"
              onConfirm={() => alert(`Reactivated ${student.name}`)}
            />
          )}
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
                  <span className="text-sm font-medium text-gray-700">
                    {course.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {course.progress}%
                  </span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No courses enrolled.</p>
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
                  <p className="text-sm text-gray-700">{act.text}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(act.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
