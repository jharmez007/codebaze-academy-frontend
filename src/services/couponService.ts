import Api from "../api";

// ---------------- GET ----------------
export async function getPromo(): Promise<{
  status?: number;
  message?: string;
  data?: any[];
}> {
  try {
    const response = await Api.get(`/coupons`);
    const coupons =
      response.data?.map((c: any) => ({
        id: c.id,
        code: c.code,
        created_at: c.created_at,
        type: c.discount_type === "percent" ? "percentage" : "amount",
        value: c.discount_value,
        course: c.course || "All Courses",
        expiry: c.valid_until,
        usage: c.used_count || 0,
        maxUsage: c.max_uses || 100,
        is_active: c.is_active,
        applies_to_all: c.applies_to_all,

      })) || [];

    return {
      status: response.status,
      data: coupons,
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.message ||
        "Failed to fetch coupons",
    };
  }
}

// ---------------- CREATE ----------------
export async function createPromo(
  payload: any
): Promise<{ data?: any; status?: number; message?: string }> {
  try {
    const response = await Api.post(`/coupons`, payload);
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

// ---------------- UPDATE ----------------
export async function updatePromo(
  couponId: number,
  payload: any
): Promise<{ data?: any; status?: number; message?: string }> {
  try {
    const response = await Api.patch(`/coupons/${couponId}`, payload);
    return {
      data: response.data,
      status: response.status,
      message: response.data?.message || "Coupon updated successfully",
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.message ||
        "Failed to update coupon",
    };
  }
}

// ---------------- DELETE ----------------
export async function deletePromo(
  couponId: number
): Promise<{ status?: number; message?: string }> {
  try {
    const response = await Api.delete(`/coupons/${couponId}`);
    return {
      status: response.status,
      message: response.data?.message || "Coupon deleted successfully",
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.message ||
        "Failed to delete coupon",
    };
  }
}

// ---------------- VALIDATE ----------------
export async function validatePromo(
  payload: { course_id: number; code: string },
  config?: { headers: Record<string, string> }
): Promise<{ data?: any; status?: number; message?: string }> {
  try {
    const response = await Api.post(`/coupons/validate`, payload, config);
    return {
      data: response.data,
      status: response.status,
      message: response.data?.message || "Coupon validated successfully",
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.msg ||
        error?.response?.data?.msg ||
        error.msg ||
        "Failed to validate coupon",
    };
  }
}