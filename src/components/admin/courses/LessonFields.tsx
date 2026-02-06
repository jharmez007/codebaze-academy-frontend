// src/components/admin/courses/LessonFields.tsx
"use client";

import { useFieldArray, Control, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { deleteLesson } from "@/services/courseService"; 

type LessonFieldsProps = {
  control: Control<any>;
  sectionIndex: number;
  courseId?: number; // ✅ add courseId
};


export function LessonFields({ control, sectionIndex, courseId }: LessonFieldsProps) {
  const { fields: lessonFields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.lessons`,
    keyName: "fieldId",
  });

  // ✅ Get current section id dynamically
  const sectionId = useWatch({ control, name: `sections.${sectionIndex}.id` });

  const handleRemoveLesson = async (lessonId: number | undefined, index: number) => {
    if (!courseId) {
      // toast.error("Course ID not found. Please save the course first.");
      remove(index);
      toast.info("Unsaved lesson removed.");
      return;
    }

    if (!sectionId) {
      // toast.error("Section ID not found. Please save the section first.");
      remove(index);
      toast.info("Unsaved lesson removed.");
      return;
    }

    if (!lessonId) {
      // For unsaved lessons, just remove locally
      remove(index);
      toast.info("Unsaved lesson removed.");
      return;
    }

    const toastId = toast.loading("Removing lesson...");
    try {
      const res = await deleteLesson(courseId, sectionId, lessonId);
      if (res.status === 200) {
        remove(index);
        toast.success("Lesson deleted successfully!");
      } else {
        toast.error(res.message || "Failed to delete lesson.");
      }
    } catch (err) {
      console.error("Error deleting lesson:", err);
      toast.error("An error occurred while deleting the lesson.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="space-y-4">
      {lessonFields.map((lesson, lessonIndex) => (
        <Card key={lesson.fieldId} className="p-3 space-y-3 bg-gray-50 dark:bg-gray-800">
          {/* Title */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="01 - Introduction"
                    {...field}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remove Button */}
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemoveLesson((lesson as any)?.id, lessonIndex)} // ✅ API call
          >
            Remove Lesson
          </Button>
        </Card>
      ))}
      
      {/* Add Lesson Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            title: "",
          })
        }
      >
        + Add Lesson
      </Button>
    </div>
  );
}
