import Api from "../api";

// --- Send Chatbot Message ---
export async function sendChatMessage(data: {
  email: string;
  message: string;
}
) {
  try {
    const response = await Api.post("/chatbot/message", data);
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