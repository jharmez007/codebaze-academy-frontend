// src/components/admin/courses/SectionFields.tsx
"use client";

import { useFieldArray, Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SectionFieldsProps = {
  control: Control<any>;
};

export function SectionFields({ control }: SectionFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
    keyName: "fieldId",
  });

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
                  <Input
                    placeholder="HTML Essentials"
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

          <Button type="button" variant="destructive" onClick={() => remove(sectionIndex)}>
            Remove Section
          </Button>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            section: "",
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
