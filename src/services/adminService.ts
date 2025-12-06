import Api from "../api";

export const getAdminOverview = async () => {
  try {
    const response = await Api.get("/admin/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    throw error;
  }
};

export async function getExchangeRate(): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.get("/admin/exchange-rate");

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.message,
    };
  }
}

export async function updateExchangeRate(
  newRate: number
): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/admin/exchange-rate", {
      ngn_to_usd: newRate,
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
        error.message,
    };
  }
}

export async function subscribeNewsletter(
  name: string,
  email: string
): Promise<{
  data?: any;
  status?: number;
  message?: string;
}> {
  try {
    const response = await Api.post("/admin/newsletter/subscribe", {
      name,
      email,
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