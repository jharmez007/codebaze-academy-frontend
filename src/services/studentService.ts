import Api from "../api";

export interface Student {
  id: number;
  name: string;
  email: string;
  courses: string;
  date: string;
  is_suspended: boolean; // true = suspended, false = active
}

// Get all students
export async function getStudents() {
  try {
    const response = await Api.get<Student[]>("/students/");
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.message || error.message,
    };
  }
}

// Get student by ID
export async function getStudentById(id: number) {
  try {
    const response = await Api.get<Student>(`/students/${id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.message || error.message,
    };
  }
}

// Suspend/Unsuspend student
export async function suspendStudent(id: number, suspend: boolean) {
  try {
    const response = await Api.patch(`/students/${id}/suspend`, {
      is_suspended: suspend,
    });
    return { status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.message || error.message,
    };
  }
}
