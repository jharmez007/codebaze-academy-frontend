import { errorResponseHandler } from "@/utils/auth";
import Api from "../api";

// -----------------------------
// Create / Edit Course API
// -----------------------------

export interface LessonPayload {
  id: number;
  title: string;
  notes?: string;
  references?: string;
}

export interface SubcategoryPayload {
  id: number;
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
    return errorResponseHandler(error)
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
    return errorResponseHandler(error)
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
    return errorResponseHandler(error)
  }
}


// -----------------------------
// Load Course Table API
// -----------------------------

export interface Course {
  id: number;
  created_at: string;
  slug: string;
  title: string;
  price: number;
  total_lessons: number;
  is_published: boolean; // 1 = published, 0 = draft
}

export interface LessonDetail {
  id: number;
  title: string;
  notes?: string;
  document_url?: string;
  video_url?: string;
  reference_link?: any; 
  created_at: string;
  updated_at: string;
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
    return errorResponseHandler(error)
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
    return errorResponseHandler(error)
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
    return errorResponseHandler(error)
  }
}

// -----------------------------
// Delete Section
// -----------------------------
export async function deleteSection(
  courseId: number,
  sectionId: number
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.delete(`/courses/${courseId}/sections/${sectionId}`);
    return { status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}


// -----------------------------
// Delete Lesson
// -----------------------------
export async function deleteLesson(
  courseId: number,
  sectionId: number,
  lessonId: number
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.delete(
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
    );
    return { status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}


// -----------------------------
// Lessons API
// -----------------------------

// ✅ Get course lesson by id
export async function getCourseLessonById(
  id: number
): Promise<{
  data?: Course;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<Course>(`/courses/${id}/full`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

// ✅ Get lesson by id
export async function getLessonById(
  id: number
): Promise<{
  data?: LessonDetail;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get<LessonDetail>(`/courses/lessons/${id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}


// -----------------------------
// Update Course Lesson
// -----------------------------
export async function updateLesson(
  courseId: number,
  lessonId: number,
  formData: FormData
): Promise<{ status?: number; message?: string; data?: any }> {
  try {
    const response = await Api.put(
      `/courses/${courseId}/lessons/${lessonId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { status: response.status, data: response.data };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

// -----------------------------
// Quiz API
// -----------------------------

export async function addQuiz(
  courseId: number,
  lessonId: number,
  payload: {
    question: string;
    options: string[];
    correct_answer: string;
    quiz_type: string;
    explanation?: string;
  }
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.post(
      `/courses/${courseId}/lessons/${lessonId}/add-quiz`,
      payload
    );
    return { status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function updateQuiz(
  lessonId: number,
  quizzesId: number,
  payload: {
    question: string;
    options: string[];
    correct_answer: string;
    quiz_type: string;
    explanation?: string;
  }
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.put(
      `courses/lessons/${lessonId}/quizzes/${quizzesId}`,
      payload
    );
    return { status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

// -----------------------------
// Delete Quiz
// -----------------------------
export async function deleteQuiz(
  quizzesId: number,
  lessonId: number
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.delete(
      `courses/lessons/${lessonId}/quizzes/${quizzesId}`
    );
    return { status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}




