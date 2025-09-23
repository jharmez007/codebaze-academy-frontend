"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"; // shadcn calendar if you have it
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type Promotion = {
  id?: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  course: string;
  expiry: string;
  maxUsage: number;
};

type PromotionFormProps = {
  initialData?: Promotion; // if provided → edit mode
  onSubmit: (promo: Promotion) => void;
  onCancel: () => void;
};

export default function PromotionForm({
  initialData,
  onSubmit,
  onCancel,
}: PromotionFormProps) {
  const [code, setCode] = useState(initialData?.code || "");
  const [type, setType] = useState<"percentage" | "fixed">(
    initialData?.type || "percentage"
  );
  const [value, setValue] = useState(initialData?.value || 0);
  const [course, setCourse] = useState(initialData?.course || "All Courses");
  const [expiry, setExpiry] = useState<Date | undefined>(
    initialData ? new Date(initialData.expiry) : undefined
  );
  const [maxUsage, setMaxUsage] = useState(initialData?.maxUsage || 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !expiry) return;
    onSubmit({
      id: initialData?.id || `promo_${Date.now()}`,
      code,
      type,
      value,
      course,
      expiry: expiry.toISOString(),
      maxUsage,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg bg-white p-6 shadow rounded-lg"
    >
      <h2 className="text-lg font-semibold">
        {initialData ? "Edit Promotion" : "Create Promotion"}
      </h2>

      {/* Code */}
      <div className="space-y-1">
        <Label htmlFor="code">Promo Code</Label>
        <Input
          id="code"
          placeholder="WELCOME50"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      {/* Type & Value */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          <Label>Discount Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            min={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
        </div>
      </div>

      {/* Course */}
      <div className="space-y-1">
        <Label>Course</Label>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Courses">All Courses</SelectItem>
            <SelectItem value="Intro to Web Development">
              Intro to Web Development
            </SelectItem>
            <SelectItem value="React Basics">React Basics</SelectItem>
            <SelectItem value="UI/UX Fundamentals">UI/UX Fundamentals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expiry */}
      <div className="space-y-1">
        <Label>Expiry Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiry ? format(expiry, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={expiry}
              onSelect={setExpiry}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Max Usage */}
      <div className="space-y-1">
        <Label htmlFor="maxUsage">Max Usage</Label>
        <Input
          id="maxUsage"
          type="number"
          min={1}
          value={maxUsage}
          onChange={(e) => setMaxUsage(Number(e.target.value))}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Save Changes" : "Create"}</Button>
      </div>
    </form>
  );
}
