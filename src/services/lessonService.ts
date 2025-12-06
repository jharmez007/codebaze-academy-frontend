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
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
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
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}