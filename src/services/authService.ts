import { errorResponseHandler } from "@/utils/auth";
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
     return errorResponseHandler(error)
  }
}

export async function logout(): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/logout");

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
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
    return errorResponseHandler(error)
  }
}

export async function verifyToken(
  payload: {
    email: string;
    token: string;
  }
): Promise<{
  status?: number;
  message?: string;
  access_token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}> {
  try {
    const response = await Api.post(
      `/auth/verify-token`,
        payload
    );
    return {
      status: response.status,
      access_token: response.data.access_token,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error: any) {
     return errorResponseHandler(error)
  }
}

export async function createPassword(
  payload: {
    password: string;
    full_name?: string;
  },
  config?: { headers: Record<string, string> }
): Promise<{ status?: number; message?: string;  }> {
  try {
    const response = await Api.post(
      `/auth/create-password`,
        payload,
        config
    );
    return { status: response.status };
  } catch (error: any) {
     return errorResponseHandler(error)
  }
}

// -----------------------------
// Password Reset APIs
// -----------------------------

export async function forgotPassword(
  payload: {
    email: string;
  },
): Promise<{ status?: number; message?: string;  }> {
  try {
    const response = await Api.post(
      `/auth/forgot-password`,
        payload,
    );
    return { status: response.status };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}


export async function verifyResetToken(
  payload: { token: string; email?: string }
): Promise<{
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post(`/auth/verify-reset-token`, payload);
    return { status: response.status, message: response.data.message };
  } catch (error: any) {
     return errorResponseHandler(error)
  }
}

export async function resetPassword(
  payload: { token: string; password: string; email?: string }
): Promise<{
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post(`/auth/reset-password`, payload);
    return { status: response.status, message: response.data.message };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function sendVerificationOTP(
  payload: { email: string }
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.post("/resend-verification", payload);
    return { status: response.status, message: response.data.message };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function changePassword(payload: {
  old_password: string;
  new_password: string;
}): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/auth/change-password", payload);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function changeEmail(newEmail: string): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/auth/change-email", {
      new_email: newEmail,
    });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

export async function verifyNewEmail(
  email: string,
  token: string
): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/auth/verify-new-email", {
      email,
      token,
    });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

