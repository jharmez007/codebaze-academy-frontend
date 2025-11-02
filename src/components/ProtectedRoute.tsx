"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loading) return; // wait for auth context to finish

    const isAdminRoute = pathname.startsWith("/admin");

    // Unauthenticated users
    if (!isAuthenticated) {
      router.replace(isAdminRoute ? "/admin-login" : "/login");
      return;
    }

    // Authenticated but role mismatch
    if (isAdminRoute && user?.role !== "admin") {
      router.replace("/login");
      return;
    }

    if (!isAdminRoute && user?.role === "admin") {
      router.replace("/admin-login");
      return;
    }

    // Passed all checks
    setIsReady(true);
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading || !isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
