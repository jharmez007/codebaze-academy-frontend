// src/services/enrollmentService.ts
import Api from "../api";

export async function enroll(
  courseId: number,
  payload: any,
  config?: { headers: Record<string, string> }
): Promise<{ status?: number; message?: string; full_name?: string; }> {
  try {
    const response = await Api.post(`/enrollments/${courseId}`, payload, config);
    return { status: response.status, message: response.data.message, full_name: response.data.full_name };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.message ||
        error.message,
    };
  }
}

export async function enrollRequest(
  payload: {
    email: string;
  }
): Promise<{ status?: number; message?: string; state?: string; }> {
  try {
    const response = await Api.post(
      `/enrollments/request`,
        payload
    );
    return { 
      status: response.status, 
      state: response.data.state, 
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error.message,
    };
  }
}

