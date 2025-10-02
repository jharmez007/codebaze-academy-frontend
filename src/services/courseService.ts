// src/services/courseApi.ts
import Api from "../api";

export interface LessonPayload {
  title: string;
  notes?: string;
  references?: string;
}

export interface SubcategoryPayload {
  name: string;
  lessons: LessonPayload[];
  description: string;
}

export interface CoursePayload {
  title: string;
  description: string;
  long_description: string;
  price: number;
  sections: SubcategoryPayload[];
  image?: File | null;
  files?: Record<string, File>; // e.g. { "sub_0_lesson_0_video": File }
}

export interface ApiSuccess<T> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

function buildFormData(body: CoursePayload): FormData {
  const formData = new FormData();

  const dataPayload = {
    title: body.title,
    description: body.description,
    long_description: body.long_description,
    price: body.price,
    sections: body.sections,
  };
  formData.append("data", JSON.stringify(dataPayload));

  if (body.image) {
    formData.append("image", body.image);
  }

  if (body.files) {
    Object.entries(body.files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });
  }

  return formData;
}

export async function createCourse<T = unknown>(
  body: CoursePayload
): Promise<ApiResponse<T>> {
  try {
    const formData = buildFormData(body);
    const response = await Api.post<T>("/courses/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    const error = err as any;
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}

export async function updateCourse<T = unknown>(
  id: string,
  body: CoursePayload
): Promise<ApiResponse<T>> {
  try {
    const formData = buildFormData(body);
    const response = await Api.put<T>(`/courses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    const error = err as any;
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}


// ✅ Get course by id
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


// -----------------------------
// Load Course API
// -----------------------------

export interface Course {
  id: number;
  slug: string;
  title: string;
  price: number;
  total_lessons: number;
  is_published: boolean; // 1 = published, 0 = draft
}

export async function getCourses(): Promise<{
  data?: Course[];
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course[]>("/courses/admin");
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

export async function deleteCourse(id: number): Promise<{
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.delete(`/courses/${id}`);
    return { status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}

export async function publishCourse(
  id: number,
  publish: boolean
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.patch(`/courses/${id}/publish`, {
      is_published: publish ? 1 : 0,
    });
    return { status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}




