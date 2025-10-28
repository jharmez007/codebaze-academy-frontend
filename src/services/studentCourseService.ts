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
  slug: string;
  title: string;
  price: number;
  description: string;
  long_description: string;
  total_lessons: number;
  sections: Subcategory[];
  image?: File | null;
  is_published: boolean; 
}

export async function getCourses(): Promise<{
  data?: Course[];
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course[]>("/courses/");
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}


export async function getCourseById(
  id: number
): Promise<{
  data?: Course;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course>(`/courses/${id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}