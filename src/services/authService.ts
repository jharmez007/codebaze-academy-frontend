import Api from "../api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function login(
  body: LoginRequest
): Promise<{ data?: LoginResponse; status?: number; message?: string }> {
  try {
    const response = await Api.post<LoginResponse>("/auth/login", body);

    return {
      data: response.data,
      status: response.status,
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
