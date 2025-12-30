import axios from "axios";
import { refreshToken } from "./utils/refresh";

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    // ⛔ Offline
    if (!navigator.onLine) {
      return Promise.reject({
        type: "network",
        message: "No internet connection. Please check your network.",
      });
    }

    // ⏱ Timeout
    if (error.code === "ECONNABORTED" && error.message.includes("timeout") ) {
      throw new Error("Request timed out. Please try again.")
    }

    // ⛔ Offline
    if (error?.response?.status === "(failed)net::ERR_PROXY_CONNECTION_FAILED )" ) {
      throw new Error("No internet connection. Please check your network.")
    }

    // 🔄 Token refresh
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.msg?.includes("Token has expired") &&
      !prevRequest?._retry
    ) {
      prevRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        return Api({
          ...prevRequest,
          headers: {
            ...prevRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } catch {
        return Promise.reject({
          type: "auth",
          message: "Session expired. Please log in again.",
        });
      }
    }

    // Let other errors pass through
    return Promise.reject(error);
  }
);

export default Api;
