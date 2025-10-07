// src/components/admin/courses/CourseForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

import { SectionFields } from "./SectionFields";
import { LessonFields } from "./LessonFields";

import { createCourse, updateCourse, CoursePayload } from "@/services/courseService"; 

// ---------------- Schema ----------------
const courseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Short description is required"),
  long_description: z.string().min(2, "Long description is required"),
  image: z.any().optional(),
  sections: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().min(3, "Section title is required"),
        description: z.string().min(5, "Description is required"),
        lessons: z
          .array(
            z.object({
              id: z.number().optional(),
              title: z.string().min(3, "Lesson title is required"),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

type CourseSchema = z.infer<typeof courseSchema>;

type CourseFormProps = {
  defaultValues?: Partial<CourseSchema>;
  isEdit?: boolean;
  id?: any;
};

export default function CourseForm({ defaultValues, isEdit, id }: CourseFormProps) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    defaultValues?.image && typeof defaultValues.image === "string"
      ? defaultValues.image
      : null
  );

  const router = useRouter();

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues || {
      title: "",
      price: "",
      description: "",
      long_description: "",
      image: null,
      sections: [],
    },
  });


  const { control, handleSubmit, trigger, setValue, reset } = form;

  // ✅ Hydrate with defaults
  useEffect(() => {
    if (defaultValues) {
      const safeDefaults = {
        ...defaultValues,
        price: defaultValues.price !== undefined ? String(defaultValues.price) : "",
      };
      reset(safeDefaults);
      // Set preview if editing and image is a string (URL)
      if (safeDefaults.image && typeof safeDefaults.image === "string") {
        setPreviewImage(safeDefaults.image);
      }
    }
  }, [defaultValues, reset]);

  // ---------------- Data Transformer ----------------
  const buildApiPayload = (data: CourseSchema): CoursePayload => {
  const files: Record<string, File> = {};

  data.sections?.forEach((s, subIndex) => {
    s.lessons?.forEach((l, lessonIndex) => {
      const videoKey = `sub_${subIndex}_lesson_${lessonIndex}_video`;
      const docKey = `sub_${subIndex}_lesson_${lessonIndex}_doc`;
      if ((l as any).video) files[videoKey] = (l as any).video;
      if ((l as any).doc) files[docKey] = (l as any).doc;
    });
  });

    return {
      title: data.title.trim(),
      description: data.description.trim(),
      long_description: data.long_description.trim(),
      price: Number(data.price),
      sections: (data.sections ?? []).map((s) => ({
        id: Number(s.id), // ✅ preserve section id
        name: s.name.trim(),
        description: s.description.trim(),
        lessons: (s.lessons ?? []).map((l) => ({
          id: Number(l.id), // ✅ preserve lesson id
          title: l.title.trim(),
        })),
      })),
      image: data.image || null,
      files,
    };
  };


  // ---------------- Step Navigation ----------------
  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["title", "price", "description", "long_description", "image"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["sections"]);
      if (valid) setStep(3);
    } else if (step === 3) {
      // validate lesson titles if needed
      const valid = await trigger(["sections"]);
      if (valid) setStep(4);
    }
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // ---------------- Final onSubmit ----------------
  const onSubmit = async (data: CourseSchema) => {
    setIsSaving(true);
    const toastId = toast.loading(isEdit ? "Updating course..." : "Creating course...");
    
    try {
      const payload = buildApiPayload(data);
      const response = isEdit
        ? await updateCourse(id, payload)
        : await createCourse(payload);

      if (!("status" in response) || ![200, 201].includes(response.status)) {
        throw new Error(
          "message" in response ? response.message : "Unexpected server response"
        );
      }

      router.push("/admin/courses?success=1");
    } catch (error) {
      console.error(error);
      router.push("/admin/courses?error=1");
    } finally {
      toast.dismiss(toastId); 
      setIsSaving(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-6">
      {/* Step 1: Course Info */}
      {step === 1 && (
        <Form {...form}>
          <form className="space-y-6 max-w-2xl">
            <FormField control={control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl><Input placeholder="Frontend Foundations" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₦)</FormLabel>
                <FormControl><Input type="text" placeholder="45000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl><Textarea placeholder="Enter a short summary..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="long_description" render={({ field }) => (
              <FormItem>
                <FormLabel>Long Description</FormLabel>
                <FormControl><Textarea placeholder="Detailed course description..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Course Image</FormLabel>
                  <FormControl>
                    <div>
                      {previewImage ? (
                        <div className="relative inline-block mb-2">
                          <img
                            src={previewImage}
                            alt="Course"
                            className="rounded-md border w-32 h-32 object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                            onClick={() => {
                              setPreviewImage(null);
                              setValue("image", null);
                            }}
                            title="Remove image"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setValue("image", file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setPreviewImage(ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setPreviewImage(null);
                            }
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" onClick={nextStep} className="bg-green-600 text-white">
              Next: Add Sections
            </Button>
          </form>
        </Form>
      )}

      {/* Step 2: Sections */}
      {step === 2 && (
        <Form {...form}>
          <form className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-semibold">Course Sections</h2>
            <SectionFields control={control} courseId={id} />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
              <Button type="button" onClick={nextStep} className="bg-green-600 text-white">
                Next: Add Lessons
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Step 3: Lessons */}
      {step === 3 && (
        <Form {...form}>
          <form className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-semibold">Course Lessons</h2>
            {form.watch("sections")?.map((_, sectionIndex) => (
              <Card key={sectionIndex} className="p-4 space-y-4">
                <h3 className="font-bold">
                  {form.watch(`sections.${sectionIndex}.name`) || "Untitled Section"}
                </h3>
                <LessonFields control={control} sectionIndex={sectionIndex} courseId={id} />
              </Card>
            ))}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
              <Button type="button" onClick={nextStep} className="bg-green-600 text-white">
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

            <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-6 space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">Course Info</h3>
              <p><strong>Title:</strong> {form.watch("title")}</p>
              <p><strong>Price:</strong> ₦{form.watch("price")}</p>
              <p><strong>Short Description:</strong> {form.watch("description")}</p>
              <p><strong>Long Description:</strong> {form.watch("long_description")}</p>
            </div>

            <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Sections</h3>
              {form.watch("sections")?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded border p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-bold text-green-600">{section.name}</h4>
                  <p>{section.description}</p>
                  {section.lessons && section.lessons.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-semibold mt-2">Lessons</h5>
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {section.lessons.map((lesson, i) => (
                          <li key={i} className="py-2">
                            <p className="font-medium">{lesson.title}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
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
