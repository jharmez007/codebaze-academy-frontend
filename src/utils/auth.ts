import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function isTokenValid(): boolean {
  if (typeof window === "undefined") return false; 

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const isExpired = decoded.exp * 1000 < Date.now(); 
    return !isExpired;
  } catch {
    return false;
  }
}

export const errorResponseHandler = (error : any) => {
   return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.data?.msg ||
        error?.response?.data?.msg ||
        error.error || "Something went wrong",
    };
}