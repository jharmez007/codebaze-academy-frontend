import axios from "axios";

const RefreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
});

export async function refreshToken(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("refreshToken can only run in the browser");
  }

  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token available");

  const response = await RefreshApi.post("/auth/refresh", null, {
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    },
  });

  const newAccessToken: string | undefined = response?.data?.data?.access_token;

  if (!newAccessToken) {
    throw new Error("No access token returned from refresh");
  }

  localStorage.setItem("token", newAccessToken);
  return newAccessToken;
}
