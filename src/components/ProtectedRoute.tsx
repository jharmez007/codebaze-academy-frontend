"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin-login"); // redirect if not logged in
    }
  }, [loading, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // nothing while redirecting
  }

  return <>{children}</>;
}
