// src/components/admin/courses/CourseForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { promiseToast } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

import { SectionFields } from "./SectionFields";
import { LessonFields } from "./LessonFields";


// ---------------- Schema ----------------
const courseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(2, "Long description is required"),
  type: z.enum(["dynamic", "static"], {
    required_error: "Course type is required",
  }),
  image: z.any().optional(),
  sections: z
    .array(
      z.object({
        section: z.string().min(3, "Section title is required"),
        slug: z.string().min(3, "Slug is required"),
        description: z.string().min(5, "Description is required"),
        lessons: z
          .array(
            z.object({
              title: z.string().min(3, "Lesson title is required"),
              slug: z.string().min(3, "Slug is required"),
              duration: z.string().min(1, "Duration required"),
              size: z.string().min(1, "Size required"),
              type: z.enum(["video", "pdf"], { required_error: "Type required" }),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

type CourseSchema = z.infer<typeof courseSchema>;

// ---------------- Helpers ----------------
const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

type CourseFormProps = {
  defaultValues?: Partial<CourseSchema>;
  isEdit?: boolean;
};

export default function CourseForm({ defaultValues, isEdit }: CourseFormProps) {
  const [step, setStep] = useState(1);
  const [manualSlug, setManualSlug] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues || {
      title: "",
      slug: "",
      price: "",
      description: "",
      longDescription: "",
      type: undefined,
      image: null,
      sections: [],
    },
  });

  const { control, handleSubmit, setValue, reset } = form;

  // ✅ Hydrate with defaults
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // ---------------- Unified onSubmit ----------------
  const onSubmit = async (data: CourseSchema) => {
    if (step === 1) return setStep(2);
    if (step === 2) return setStep(3);
    if (step === 3) return setStep(4);

    if (step === 4) {
      setIsSaving(true);
      try {
        await promiseToast(
          new Promise((resolve) => setTimeout(resolve, 1500)), // fake save
          {
            loading: isEdit ? "Updating course..." : "Creating course...",
            success: isEdit ? "Course updated successfully!" : "Course created successfully!",
            error: "Failed to save course",
          }
        );
        router.push("/admin/courses?success=1");
      } catch {
        router.push("/admin/courses?error=1");
      } finally {
        setIsSaving(false);
      }
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-6">
      {/* Step 1: Course Info */}
      {step === 1 && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Frontend Foundations"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!manualSlug) {
                          form.setValue("slug", slugify(e.target.value), { shouldDirty: true });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="frontend-foundations"
                      {...field}
                      onChange={(e) => {
                        field.onChange(slugify(e.target.value));
                        setManualSlug(true);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₦)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="45000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a short summary..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Long Description */}
            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed course description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                      <SelectItem value="static">Static</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Course Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setValue("image", e.target.files?.[0] || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-green-600 text-white">
              Next: Add Sections
            </Button>
          </form>
        </Form>
      )}

      {/* Step 2: Sections */}
      {step === 2 && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-semibold">Course Sections</h2>
            <SectionFields form={form} control={control} slugify={slugify} />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="bg-green-600 text-white">
                Next: Add Lessons
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Step 3: Lessons */}
      {step === 3 && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-semibold">Course Lessons</h2>
            {form.watch("sections")?.map((_, sectionIndex) => (
              <Card key={sectionIndex} className="p-4 space-y-4">
                <h3 className="font-bold">
                  {form.watch(`sections.${sectionIndex}.section`) || "Untitled Section"}
                </h3>
                <LessonFields
                  form={form}
                  control={control}
                  sectionIndex={sectionIndex}
                  slugify={slugify}
                />
              </Card>
            ))}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" className="bg-green-600 text-white">
                Next: Review & Save
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Step 4: Review & Save */}
      {step === 4 && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
            <h2 className="text-2xl font-bold">Review & Save</h2>

            {/* Course Info */}
            <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-6 space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">Course Info</h3>
              <p><strong>Title:</strong> {form.watch("title")}</p>
              <p><strong>Slug:</strong> <span className="text-gray-500">{form.watch("slug")}</span></p>
              <p><strong>Price:</strong> ₦{form.watch("price")}</p>
              <p><strong>Type:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    form.watch("type") === "dynamic"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {form.watch("type")}
                </span>
              </p>
              <p><strong>Short Description:</strong> {form.watch("description")}</p>
              <p><strong>Long Description:</strong> {form.watch("longDescription")}</p>
            </div>

            {/* Sections + Lessons */}
            <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Sections</h3>
              {form.watch("sections")?.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="rounded border p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
                >
                  <h4 className="font-bold text-green-600">{section.section}</h4>
                  <p className="text-sm text-gray-500">Slug: {section.slug}</p>
                  <p>{section.description}</p>

                  {section.lessons && section.lessons.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-semibold mt-2">Lessons</h5>
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="py-2">
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-gray-500">Slug: {lesson.slug}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>⏱ {lesson.duration}</span>
                              <span>💾 {lesson.size}</span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                {lesson.type}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : isEdit ? "Update Course" : "Save Course"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
