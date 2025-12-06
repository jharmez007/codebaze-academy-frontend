"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { createPromo, updatePromo } from "../../../services/couponService";
import { getCourses } from "../../../services/courseService";
import type { Course } from "../../../services/courseService";

type Promotion = {
  id?: string | number;
  code: string;
  type: "percentage" | "amount";
  value: number;
  course: string;
  expiry: string;
  maxUsage: number;
  applies_to_all: boolean;
};

type PromotionFormProps = {
  initialData?: Promotion;
  onCancel: () => void;
  onSuccess?: (newPromo: Promotion) => void;
};

export default function PromotionForm({
  initialData,
  onCancel,
  onSuccess,
}: PromotionFormProps) {
  const [code, setCode] = useState(initialData?.code || "");
  const [type, setType] = useState<"percentage" | "amount">(
    initialData?.type || "percentage"
  );
  const [value, setValue] = useState(initialData?.value || 0);
  const [expiry, setExpiry] = useState<Date | undefined>(
    initialData ? new Date(initialData.expiry) : undefined
  );
  const [maxUsage, setMaxUsage] = useState(initialData?.maxUsage || 100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const initialCourse = initialData?.applies_to_all
  ? "All Courses"
  : initialData?.course || "All Courses";

const [course, setCourse] = useState(initialCourse);
const [appliesToAll, setAppliesToAll] = useState(initialCourse === "All Courses");


  // ✅ Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getCourses();
      if (response.data) {
        setCourses(response.data);
      } else {
        toast.error(response.message || "Failed to load courses");
      }
      setLoadingCourses(false);
    };
    fetchCourses();
  }, []);

  // ✅ Handle submit (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !expiry) return;

    setLoading(true);
    setError(null);

    const payload = {
      code,
      type: "general",
      discount_type: type === "percentage" ? "percent" : "amount",
      discount_value: value,
      max_uses: maxUsage,
      valid_until: expiry.toISOString(),
      commission: 0,
      applies_to_all: appliesToAll,
      course_ids: appliesToAll
        ? []
        : courses
            .filter((c) => c.title === course)
            .map((c) => c.id),
    };

    let response;

    if (initialData?.id) {
      response = await updatePromo(Number(initialData.id), payload);
    } else {
      response = await createPromo(payload);
    }

    setLoading(false);

    if (response.status === 200 || response.status === 201) {
      toast.success(
        initialData ? "Coupon updated successfully" : "Coupon created successfully"
      );

      const newPromo: Promotion = {
        id: response?.data?.coupon?.id ?? initialData?.id ?? `promo_${Date.now()}`,
        code,
        type,
        value,
        course,
        expiry: expiry.toISOString(),
        maxUsage,
        applies_to_all: appliesToAll,
      };

      onSuccess?.(newPromo);
    } else {
      setError(response.message || "Operation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg bg-white dark:bg-background p-6 shadow rounded-lg"
    >
      <h2 className="text-lg font-semibold">
        {initialData ? "Edit Promotion" : "Create Promotion"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Code */}
      <div className="space-y-1">
        <Label htmlFor="code">Promo Code</Label>
        <Input
          id="code"
          placeholder="WELCOME50"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          disabled={!!initialData} // prevent editing code for existing promo
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
              <SelectItem value="amount">Fixed Amount</SelectItem>
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
        <Select
          value={course}
          onValueChange={(v) => {
            setCourse(v);
            setAppliesToAll(v === "All Courses");
          }}
          disabled={loadingCourses}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingCourses ? "Loading..." : "Select course"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Courses">All Courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.title}>
                {c.title}
              </SelectItem>
            ))}
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
        <Button type="submit" disabled={loading}>
          {loading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Save Changes"
            : "Create"}
        </Button>
      </div>
    </form>
  );
}
