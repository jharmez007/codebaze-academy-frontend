import Api from "../api";

// GET /profile
export async function getProfile(): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get("/students/profile");

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

// PATCH /profile  — supports multipart + JSON social_handles
export async function updateProfile(payload: {
  full_name?: string;
  bio?: string;
  social_handles?: Record<string, string>;
  photo?: File | null;
}): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const formData = new FormData();

    if (payload.full_name) formData.append("full_name", payload.full_name);
    if (payload.bio) formData.append("bio", payload.bio);

    // social_handles must be stringified to send in multipart/form-data
    if (payload.social_handles) {
      formData.append("social_handles", JSON.stringify(payload.social_handles));
    }

    if (payload.photo) {
      formData.append("photo", payload.photo);
    }

    const response = await Api.patch("/students/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

export async function listSessions(): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get("/students/sessions");

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

export async function deleteSession(
  sessionId: number
): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.delete(`/students/sessions/${sessionId}`);

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

// ================================
// Get all user payments
// ================================
export async function listPayments(): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get("/students/payments");

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

// ================================
// Download payment invoice (PDF)
// ================================
export async function downloadInvoice(
  paymentId: number
): Promise<{
  data?: Blob;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get(`/students/payments/${paymentId}/invoice`, {
      responseType: "blob", // important for files
    });

    return {
      data: response.data, // You will need to handle this blob to download file
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

export async function deleteAccount(
  payload: {
    password: string;
  }
): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.delete(`/delete-account`, { data: payload });

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

