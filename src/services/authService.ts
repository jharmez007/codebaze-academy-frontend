import Api from "../api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  refresh_token: string;
  access_token: string;
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
    const response = await Api.post<LoginResponse>("/login", body);

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

// -----------------------------
// Register API
// -----------------------------

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

export async function register(
  body: RegisterRequest
): Promise<{ data?: RegisterResponse; status?: number; message?: string }> {
  try {
    const response = await Api.post<RegisterResponse>("/register", body);

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


