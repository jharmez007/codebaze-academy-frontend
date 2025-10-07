// src/components/admin/courses/SectionFields.tsx
"use client";

import { useFieldArray, Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner"; 
import { deleteSection } from "@/services/courseService"; 

type SectionFieldsProps = {
  control: Control<any>;
  courseId?: number;
};

export function SectionFields({ control, courseId }: SectionFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
    keyName: "fieldId",
  });

  const handleRemove = async (sectionId: number | undefined, index: number) => {
    if (!courseId) {
      // toast.error("Course ID not found. Please save the course first.");
      remove(index);
      toast.info("Unsaved section removed.");
      return;
    }

    if (!sectionId) {
      // This section might not exist in backend yet
      remove(index);
      toast.info("Unsaved section removed.");
      return;
    }

    const toastId = toast.loading("Removing section...");
    try {
      const res = await deleteSection(courseId, sectionId);
      if (res.status === 200) {
        remove(index);
        toast.success("Section deleted successfully!");
      } else {
        toast.error(res.message || "Failed to delete section.");
      }
    } catch (err) {
      console.error("Error deleting section:", err);
      toast.error("An error occurred while deleting the section.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((section, sectionIndex) => (
        <Card key={section.fieldId} className="p-4 space-y-4">
          {/* Section Title */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input placeholder="HTML Essentials" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={control}
            name={`sections.${sectionIndex}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="This section covers core HTML concepts..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remove Button */}
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemove(section.id, sectionIndex)}
          >
            Remove Section
          </Button>
        </Card>
      ))}

      {/* Add Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            id: undefined, // Not yet saved
            name: "",
            description: "",
            lessons: [],
          })
        }
      >
        + Add Section
      </Button>
    </div>
  );
}
