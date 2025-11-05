import Api from "../api";

interface InitializePaymentResponse {
  status?: number;
  message?: string;
  reference?: string;
  authorization_url?: string; // optional if your API provides a URL to redirect to
}

export async function initializePayment(
  course_id: string | number,
  payload: any,
  config?: any, // optional headers like Authorization
): Promise<InitializePaymentResponse> {
  try {
    const response = await Api.post(`/payments/initiate`, { course_id, ...payload }, config);

    return {
      status: response.status,
      message: response.data.message,
      reference: response.data.payment_reference,
      authorization_url: response.data.authorization_url, // assuming your API returns a redirect URL
    };
  } catch (error: any) {
    return {
      message: error?.response?.data?.error || error.error,
    };
  }
}
