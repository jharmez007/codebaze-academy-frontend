import { errorResponseHandler } from "@/utils/auth";
import Api from "../api";

export async function markLessonComplete(
  lesson_id: string
): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/progress/complete", { lesson_id });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function uncompleteLesson(lesson_id: string): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/progress/uncomplete", { lesson_id });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function downloadLessonDocument(
  lesson_id: number
): Promise<{
  data?: Blob;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get(`/courses/lessons/${lesson_id}/document`, {
      responseType: "blob",
    });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}