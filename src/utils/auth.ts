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
