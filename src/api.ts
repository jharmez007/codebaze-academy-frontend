import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshToken } from "./utils/refresh";

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
});

Api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

 

Api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const prevRequest = error.config as RetryAxiosRequestConfig;

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      return Promise.reject(new Error("Request timed out"));
    }

    if (
      error.response?.status === 401 &&
      (error.response?.data as any)?.msg?.includes("Token has expired") &&
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
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default Api;
