// src/services/studentCourseService.ts
import Api from "../api";

export interface Lesson {
  id: number;
  title: string;
  duration: number; // in minutes
  size: string; // in MB
}

export interface Subcategory {
  id: number;
  name: string;
  lessons: Lesson[];
  description: string;
}

export interface Course {
  id: number;
  created_at: string;
  currency: string;
  slug: string;
  title: string;
  price: number;
  description: string;
  long_description: string;
  total_lessons: number;
  sections: Subcategory[];
  image?: File | null;
  is_published: boolean; 
  is_paid: boolean;
  is_enrolled?: boolean;
}

export async function getCourses(
  config?: { headers: Record<string, string> }
): Promise<{
  data?: Course[];
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course[]>("/courses/", config);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

export async function getCurrency(
  config?: { headers: Record<string, string> }
): Promise<{
  data?: Course[];
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course[]>("/admin/debug/currency", config);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

export async function getCourseById(
  id: number,
  config?: { headers: Record<string, string> },
): Promise<{
  data?: Course;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course>(`/courses/${id}`, config);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

