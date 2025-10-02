// src/components/admin/courses/LessonFields.tsx
"use client";

import { useFieldArray, Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LessonFieldsProps = {
  control: Control<any>;
  sectionIndex: number;
};

export function LessonFields({ control, sectionIndex, }: LessonFieldsProps) {
  const { fields: lessonFields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.lessons`,
    keyName: "fieldId",
  });

  return (
    <div className="space-y-4">
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
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="button" variant="destructive" onClick={() => remove(lessonIndex)}>
            Remove Lesson
          </Button>
        </Card>
      ))}
    </div>
  );
}
