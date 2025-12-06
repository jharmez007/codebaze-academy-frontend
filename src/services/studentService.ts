import Api from "../api";

export interface StudentApiResponse {
  students: {
    id: number;
    name: string;
    email: string;
    course_titles: string[];
    date_joined: string;
    is_active: boolean;
  }[];
  total_students: number;
}

// Get all students
export async function getStudents() {
  try {
    const response = await Api.get<StudentApiResponse>("/students/");
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.error || error.error,
    };
  }
}

// Get student by ID
export async function getStudentById(id: number) {
  try {
    const response = await Api.get(`/students/${id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.error || error.error,
    };
  }
}

// Suspend/Unsuspend student
export async function suspendStudent(id: number, action: string) {
  try {
    const response = await Api.patch(`/students/${id}/status`, {
      action: action,
    });
    return { status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.error || error.error,
    };
  }
}

// Get all products (courses) for students
export async function getProducts() {
  try {
    const response = await Api.get("/students/my-courses");
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.error || error.error,
    };
  }
}

// ✅ Get course lesson by id
export async function getCourseId( id: number) {
  try {
    const response = await Api.get(`students/courses/${id}/full`);
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