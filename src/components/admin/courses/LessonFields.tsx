// src/components/admin/courses/LessonFields.tsx
"use client";

import { useFieldArray, Control, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LessonFieldsProps = {
  form: UseFormReturn<any>;
  control: Control<any>;
  sectionIndex: number;
  slugify: (s: string) => string;
};

export function LessonFields({ form, control, sectionIndex, slugify }: LessonFieldsProps) {
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
            slug: "",
            duration: "",
            size: "",
            type: "video",
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
                      form.setValue(
                        `sections.${sectionIndex}.lessons.${lessonIndex}.slug`,
                        slugify(e.target.value),
                        { shouldDirty: true }
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.slug`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="introduction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.duration`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="10 mins" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Size */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.size`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Size</FormLabel>
                <FormControl>
                  <Input placeholder="200 MB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.lessons.${lessonIndex}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
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
